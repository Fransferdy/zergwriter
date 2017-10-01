var home = require('./home.js');
var server = require('./server.js');
var client = require('./client.js');

var routes =[];

routes = routes.concat(home.getRoutes());
routes = routes.concat(server.getRoutes());
routes = routes.concat(client.getRoutes());

console.log('Initializing Routes: \n',routes);

module.exports = routes;