

var posthandler = function (req, res) {
  //console.log('Receive server watcher heart beat: ',req.body);
  res.send(JSON.stringify({ status: 'acknowledged' }));
  sw.registerServerWatcher(req.body.myaddress, req.body.myport);
}


function getRoutes()
{
    return [
        {path:'/serverwatcher',method:'post',handler:posthandler},
    ];
}


module.exports = {
    getRoutes
};