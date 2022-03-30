const express = require('express');
// Joi sirve para crear schemas y hacer validaciones de campos
const Joi = require('joi');
const route = express.Router();

// Users list
const usuarios = [
  {id: 1, nombre: 'Hector'},
  {id: 2, nombre: 'Carlos'},
  {id: 3, nombre: 'Andrea'}
  ];

route.get('/', (req, res) => {
  res.send(usuarios);
});

route.get('//:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) res.status(404).send('El usuario no fue encontrado');
  res.send(usuario);
});

route.post('/', (req, res) => {


  const {error, value} = validarUsuario(req.body.nombre);

  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
    };
    usuarios.push(usuario);
    res.send(usuario);
  } else {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
});

route.put('/:id', (req, res) => {
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

route.delete('/:id', (req, res) => {
  const usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);
  res.send(usuarios);
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

module.exports = route;