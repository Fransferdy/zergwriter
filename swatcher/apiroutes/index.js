var home = require('./home.js');
var spawnserver = require('./spawnserver.js');


var routes =[];

routes = routes.concat(home.getRoutes());
routes = routes.concat(spawnserver.getRoutes());

console.log('Initializing Routes: \n',routes);

module.exports = routes;