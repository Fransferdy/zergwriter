
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

