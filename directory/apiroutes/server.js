

var posthandler = function (req, res) {
  console.log('Received server heart beat: ',req.body);
  res.send(JSON.stringify({ status: 'acknowledged' }));
  servercontrol.registerServer(req.body.myaddress, req.body.myport);
}


function getRoutes()
{
    return [
        {path:'/serverbeat',method:'post',handler:posthandler},
    ];
}


module.exports = {
    getRoutes
};