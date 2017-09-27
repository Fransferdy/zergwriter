var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');
var schedule = require('node-schedule');
var rp = require('request-promise');
var fs = require('fs');
var ct = require('./controller.js');

var directoryaddress = 'failed';
var directoryport = '0';

var myaddress = 'http://localhost';
myport = 3100;
db = null;
waitfordb=false;

process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  if (index==2)
    directoryaddress = val;
  if (index==3)
    directoryport = Number(val);
});

if (directoryaddress=='failed')
  console.log('provide a directory address');
if (directoryport=='0')
  console.log('provide a directory port'); 

if (directoryaddress=='failed' || directoryport=='0')
  return;


console.log('Starting Server!');


app.use(bodyParser.json());

app.use(function (req, res, next) {
  //console.log('Received Request, Body:\n',req.body) // populated!
  next()
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

apiroutes.forEach((elem) => {
    switch(elem.method)
    {
        case 'get': app.get(elem.path,elem.handler); break;
        case 'post': app.post(elem.path,elem.handler); break;
        case 'head': app.head(elem.path,elem.handler); break;
        case 'put': app.put(elem.path,elem.handler); break;
        case 'delete': app.delete(elem.path,elem.handler); break;
    }
});

app.use('', express.static('./public'));

function startListening()
{
  app.listen(myport, function () {
  console.log('Directory app listening on port '+myport+'!');

  ct.init(directoryaddress,directoryport,myaddress,myport);

  ct.startDB();
  var j = schedule.scheduleJob('*/1 * * * *', function(){
    ct.heartBeat({myaddress,myport});
  });

}).on('error', () => {
  console.log('Porta '+ myport + ' esta em uso, usando a proxima!');
  myport++;
  startListening();
});
};

startListening();