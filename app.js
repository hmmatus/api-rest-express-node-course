const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
// Express framework para manejar consulta http
const express = require('express');
const morgan = require('morgan');
const config = require('config');
// const logger = require('./logger');
// Joi sirve para crear schemas y hacer validaciones de campos
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); // * Static resources, can access through carpet with the same name in the root project's carpet

// *Environment config
console.log('App', config.get('nombre'));
console.log('BD Server', config.get('configDB.host'));
// Users list
const usuarios = [
{id: 1, nombre: 'Hector'},
{id: 2, nombre: 'Carlos'},
{id: 3, nombre: 'Andrea'}
];

if (app.get('env') === 'development') {
// * Morgan use Case
  app.use(morgan('tiny'));
  console.log('Morgan enabled');
  inicioDebug('Morgan esta habilitado');
}

dbDebug('Conectando con base de datos');
// app.use(function(req, res, next){
//   console.log('Authenticating...')
//   next();
// });
app.get('/',(req, res) => {
  res.send('Hola mundo desde express');
});

app.get('/api/usuarios', (req, res) => {
  res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) res.status(404).send('El usuario no fue encontrado');
  res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {
  let body = req.body;
  console.log(body);
  res.json({
    body
  });

  // const {error, value} = validarUsuario(req.body.nombre);

  // if (!error) {
  //   const usuario = {
  //     id: usuarios.length + 1,
  //     nombre: value.nombre,
  //   };
  //   usuarios.push(usuario);
  //   res.send(usuario);
  // } else {
  //   const mensaje = error.details[0].message;
  //   res.status(400).send(mensaje);
  // }
});

app.put('/api/usuarios/:id', (req, res) => {
  const usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }
  const {error, value} = validarUsuario(req.body.nombre);

  if (error) {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return
  }
  usuario.nombre = value.nombre;
  res.send(usuario);

})

app.delete('/api/usuarios/:id', (req, res) => {
  const usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);
  res.send(usuarios);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}...`);
});

function existeUsuario(id) {
  return usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nombre) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({nombre: nombre});
}

