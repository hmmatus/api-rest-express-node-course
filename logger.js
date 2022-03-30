function log(req, res, next){
  // *Creating Middleware function example
  console.log('Loggin...');
  // * Next function makes the endpoint to continue after the middleware function finish, it happens before rooting function in express
  next();
}

module.exports = log;