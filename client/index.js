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

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes');

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});



app.listen(3000, function () {
  console.log('Client server listening on port 3000!');
});