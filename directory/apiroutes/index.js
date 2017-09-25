var home = require('./home.js');
var dirwatcher = require('./dirwatcher.js');
var serverwatcher = require('./serverwatcher.js');

var routes =[];

routes = routes.concat(home.getRoutes());
routes = routes.concat(dirwatcher.getRoutes());
routes = routes.concat(serverwatcher.getRoutes());

console.log('Initializing Routes: \n',routes);

module.exports = routes;