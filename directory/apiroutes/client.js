var rp = require('request-promise');

var clientPostHandler = function (req, res) {
    let servers = servercontrol.getServers();
    let chosenServer = null;
    let minClients=99999;
    let minServer = 0;
    for(let i=0; i<servers.length; i++)
    {
        if (servers[i].data.amountClients < minClients)
        {
            minClients = servers[i].data.amountClients;
            minServer = i;
        }
    }
    if (servers[minServer]==undefined || servers[minServer]==null)
    {
        res.send(JSON.stringify({ status: 'error: no server' }));
        return;
    }
    //console.log(servers[minServer]);
    res.send(JSON.stringify({ status: 'ok', address:servers[minServer].myaddress, port:servers[minServer].myport }));
}

function getRoutes()
{
    return [
        {path:'/clientjoin',method:'post',handler:clientPostHandler}
    ];
}


module.exports = {
    getRoutes
};