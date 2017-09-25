var home = require('./home.js');


var routes =[];

routes = routes.concat(home.getRoutes());

console.log('Initializing Routes: \n',routes); 

module.exports = routes;