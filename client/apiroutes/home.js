
var gethandler = function (req, res) {
  res.send('Hello World!');
}


function getRoutes()
{
    return [
        {path:'/potato',method:'get',handler:gethandler}
    ];
}

module.exports = {
    getRoutes
};