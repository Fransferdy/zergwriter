
var posthandler = function (req, res) {
  console.log('Received server spawmnrequest',req.body);
  
  sp.spawnServers(req.body.amount, req.body.diraddress,req.body.dirport);

  res.send(JSON.stringify({ status: 'ok' }));
}


function getRoutes()
{
    return [
        {path:'/spawn',method:'post',handler:posthandler},
    ];
}


module.exports = {
    getRoutes
};
