const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
// Express framework para manejar consulta http
const express = require('express');
const morgan = require('morgan');
const config = require('config');
// const logger = require('./logger');
const usuarios = require('./routes/usuarios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); // * Static resources, can access through carpet with the same name in the root project's carpet
app.use('/api/usuarios', usuarios);
// *Environment config
console.log('App', config.get('nombre'));
console.log('BD Server', config.get('configDB.host'));

if (app.get('env') === 'development') {
// * Morgan use Case
  app.use(morgan('tiny')); // Habilita un middleware para logger que devuelve cada vez que se ejecuta un endpoint
  inicioDebug('Morgan enabled');
}

dbDebug('Conectando con base de datos');
// app.use(function(req, res, next){
//   console.log('Authenticating...')
//   next();
// });
app.get('/',(req, res) => {
  res.send('Hola mundo desde express');
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}...`);
});



