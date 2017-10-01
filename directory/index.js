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

serverCapacity = 1; // how many users each server can handle
genid = require('./idgenerator.js');
servercontrol = require('./servercontroller.js');
sw = require('./swatchercontroller.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');
var schedule = require('node-schedule');

directoryaddress = 'http://localhost';
directoryport = 3001;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  //console.log('Received Request, Body:\n',req.body) // populated!
  next()
});

app.use(express.static(__dirname + '/public'));

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

app.listen(directoryport, function () {
  console.log('Directory app listening on port 3001!');

  var j = schedule.scheduleJob('* * * * *', function(){
      sw.cleanServerWatcher();
      servercontrol.cleanServer();
      servercontrol.balanceServers();
  });
});