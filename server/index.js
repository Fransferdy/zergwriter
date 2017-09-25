var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');
var schedule = require('node-schedule');
var rp = require('request-promise');

var directoryaddress = 'failed';
var directoryport = '0';

var myaddress = 'http://localhost';
var myport = 3100;

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
  console.log('Received Request, Body:\n',req.body) // populated!
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

  var j = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Checking on Directory!');

    var options = {
      method: 'POST',
      uri: directoryaddress+':'+directoryport+'/serverbeat',
      body: {
          myaddress,
          myport
      },
      json: true // Automatically stringifies the body to JSON
  };

    rp(options)
      .then(function (htmlString) {
          console.log('Directory Succesfully Pinged');
          console.log(htmlString);
      })
      .catch(function (err) {
          console.log('Unable to Ping Directory, waiting for on more minute...');
      });
  });

}).on('error', () => {
  console.log('Porta '+ myport + ' esta em uso, usando a proxima!');
  myport++;
  startListening();
});
};

startListening();