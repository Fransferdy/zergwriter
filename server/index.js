/*
Nomes: 
Fernando Barbosa Gomes RA 12194122
Guilherme Babugia RA 13809124
Opcionais funcionando:
 1 – INTERFACE [1 ponto] 
 2 – INATIVIDADE DE SERVIDORES [1 ponto] 
 3 – BALANCEAMENTO DE CARGA [1 ponto] 
 4 – DETECÇÂO E TRATAMENTO DE MULTIDÂO INSTANTÂNEA [2 pontos] 

 5 – TOLERÂNCIA A FALHAS [2 pontos] 
 7 – DIRETÓRIO [1 ponto] 
 8 – FALHAS NO DIRETÓRIO [1 ponto] 


Observações: [opcional]
Valor do Projeto: 3 Projeto Basico + 9 Opicionais = 12 pontos 
*/

directoryaddress = 'failed';
directoryport = '0';
myaddress = 'http://localhost';
myport = 3100;

dbs = require('./dbservice.js');
clients = require('./clientcontroller.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');
var schedule = require('node-schedule');
var rp = require('request-promise');
var fs = require('fs');
var ct = require('./controller.js');






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
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
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
  console.log('Server app listening on port '+myport+'!');

  ct.init(directoryaddress,directoryport,myaddress,myport);

  ct.startDB();
  var j = schedule.scheduleJob('*/5 * * * * *', function(){
    ct.heartBeat({myaddress,myport});
  });

}).on('error', () => {
  console.log('Porta '+ myport + ' esta em uso, usando a proxima!');
  myport++;
  startListening();
});
};

startListening();