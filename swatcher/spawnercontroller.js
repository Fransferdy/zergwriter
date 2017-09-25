
const { spawn } = require('child_process');

function spawnServers(amount, diraddress, dirport){

    for (let i=0; i<amount; i++)
    {
        let server = spawn('node', ['./server/index.js', diraddress, dirport]);
        console.log('Spawn sent');

        server.stdout.on('data', (data) => {
        console.log(`Server stdout: ${data}`);
        });

        server.stderr.on('data', (data) => {
        console.log(`Server stderr: ${data}`);
        });

        server.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        });
    }

};

module.exports = {
    spawnServers
};