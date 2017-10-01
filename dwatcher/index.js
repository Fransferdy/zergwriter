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


var schedule = require('node-schedule');
var rp = require('request-promise');
const { spawn } = require('child_process');

console.log('Starting Directory Watcher!');

var j = schedule.scheduleJob('*/20 * * * * *', function(){
  console.log('Checking on Directory!');

  rp('http://localhost:3001/dirwatcher')
    .then(function (htmlString) {
        let response = JSON.parse(htmlString);
        console.log('Directory Succesfully Pinged');
        console.log(response);
    })
    .catch(function (err) {
        console.log('Unable to Ping Directory, starting a new one');
        const directory = spawn('node', ['./directory/index.js']);
        console.log('Spawn sent');

        directory.stdout.on('data', (data) => {
          console.log(`Directory stdout: ${data}`);
        });

        directory.stderr.on('data', (data) => {
          console.log(`Directory stderr: ${data}`);
        });

        directory.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });

    });
});

