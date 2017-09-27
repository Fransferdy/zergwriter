var rp = require('request-promise');

var serverBeatposthandler = function (req, res) {
  console.log('Received server heart beat: ',req.body);
  res.send(JSON.stringify({ status: 'acknowledged' }));
  servercontrol.registerServer(req.body.myAddress, req.body.myPort,req.body.data);
}

var serverDbgethandler = function (req, res) {
  let servers = servercontrol.getServers();
  let chosenServer = null;
  let targetaddress = req.body.myAddress;
  let targetport= req.body.myPort;
  console.log(servers);
  for(let i=0; i<servers.length; i++)
    {
        if (servers[i].data.lastStamp>0)
        {
            chosenServer = servers[i];
            break;
        }
    }
    if (chosenServer==null)
    {
        console.log('No db availiable, start your own',req.body);
        res.send(JSON.stringify({ status: 'no known db' }));
    }else
    {
        console.log(chosenServer);
        let options = {
        method: 'GET',
        uri: chosenServer.myaddress+':'+chosenServer.myport+'/serverdb',
        body: {targetaddress, targetport},
        json: true // Automatically stringifies the body to JSON
        };

        rp(options)
        .then(function (htmlString) {
                let ob = htmlString;
                console.log(ob.status);
                if (ob.status == 'failed to send dbupdate')
                    res.send(JSON.stringify({ status: 'no known db'}));
                else
                    res.send(JSON.stringify({ status: 'sending updated db'}));
        })
        .catch(function (err) {
            console.log('failed to send db copy to fellow server');
            res.send(JSON.stringify({ status: 'no known db'}));
        });
    }
    
}

function getRoutes()
{
    return [
        {path:'/serverbeat',method:'post',handler:serverBeatposthandler},
        {path:'/serverdb',method:'get',handler:serverDbgethandler}
    ];
}


module.exports = {
    getRoutes
};