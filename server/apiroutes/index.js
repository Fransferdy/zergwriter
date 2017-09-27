var home = require('./home.js');
var server = require('./server.js');

var routes =[];

routes = routes.concat(home.getRoutes());
routes = routes.concat(server.getRoutes());

console.log('Initializing Routes: \n',routes);

module.exports = routes;