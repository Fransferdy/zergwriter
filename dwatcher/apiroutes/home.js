
var gethandler = function (req, res) {
  res.send('Hello World!');
}


function getRoutes()
{
    return [
        {path:'/',method:'get',handler:gethandler}
    ];
}

module.exports = {
    getRoutes
};