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

sp = require('./spawnercontroller');
var schedule = require('node-schedule');
var rp = require('request-promise');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');


var directoryaddress = 'http://localhost';
var directoryport = 3001;

var myaddress = 'http://localhost';
var myport = 3005;

//sp.spawnServers(2, 'http://localhost', 3001);

console.log('Starting Server Watcher!');


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


var j = schedule.scheduleJob('*/5 * * * * *', function(){
  console.log('Checking on Directory!');

    var options = {
      method: 'POST',
      uri: directoryaddress+':'+directoryport+'/serverwatcher',
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
        console.log(err);
          console.log('Unable to Ping Directory, waiting for on more minute...');
      });
  });


}).on('error', () => {
  console.log('Porta '+ myport + ' esta em uso, usando a proxima!');
  myport++;
  if (myport>3015)
    return;
  startListening();
});
};

startListening();


