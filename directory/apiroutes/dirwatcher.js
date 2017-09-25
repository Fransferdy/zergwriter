

var gethandler = function (req, res) {
  
  res.send(JSON.stringify({ status: 'hello' }));
}


function getRoutes()
{
    return [
        {path:'/dirwatcher',method:'get',handler:gethandler},
    ];
}


module.exports = {
    getRoutes
};