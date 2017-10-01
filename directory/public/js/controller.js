
var daddress = 'http://localhost';
var dport = 3001;

function renderError()
{
    let error = '<div class="container">' +
      '<h1>Unable to connect to server</h1>'+
    '</div> <!-- /container -->';

    $('#contentbox').html(error);
};

function renderAll()
{
    let dir = '<div class="container"> <h3>Servers</h3>'+
    '<div class="row">';
    for(var i=0; i< controller.servers.length;i++)
    {
        var tserver = controller.servers[i];
        let active = 'Active';
        if (tserver.data.amountClients<=0)
            active = 'Inactive';
        dir+= '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
        '<div id="f'+i+'" class="breakline">' +
        '<img src="./imgs/server.png"></img> <br>'+
        '<br>Heart Beats:'+tserver.beats +
        '<br>Last Beat:'+tserver.lastbeat +
        '<br>Last Data Stamp:'+tserver.data.lastStamp +
        '<br>Address:'+tserver.myaddress +
        '<br>Port:'+tserver.myport +
        '<br>Activity:'+active+
        '<br>Amount Users:'+tserver.data.amountClients+
        '<br></div>  '+
        '</div>  ';
    }
    dir +='</div> </div>';
    dir += '<div class="container"> <h3>Watchers</h3>'+
    '<div class="row">';
    for(var i=0; i< controller.watchers.length;i++)
    {
        var tserver = controller.watchers[i];
        dir+= '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
        '<div id="f'+i+'" class="breakline">' +
        '<img src="./imgs/watcher.png"></img> <br>'+
        '<br>Heart Beats:'+tserver.beats +
        '<br>Last Beat:'+tserver.lastbeat +
        '<br>Address:'+tserver.myaddress +
        '<br>Port:'+tserver.myport +
        '<br></div>  '+
        '</div>  ';
    }
    dir +='</div> </div>';

    $('#contentbox').html(dir);
};


var controller = {
    servers: [],
    watchers: [],
    heartBeat: function()
    {
        setTimeout(() => { // wait a bit to allow bd to return value
        var senddata = {name:controller.name,data:{color:controller.color,currfile:controller.currfile,writepos:controller.writepos}};
            $.ajax
		 ({
            type: 'GET',
            url: ('./status'),
            data: JSON.stringify(senddata),
            headers     : { 'Content-Type': 'application/json' },
            success: function (response)
			{
                var retval =	JSON.parse( response );
                controller.servers = retval.servers;
                controller.watchers = retval.watchers;
                console.log(retval);
                renderAll();
                controller.heartBeat();
            },
            error: function (err)
            {
                controller.heartBeat();
            }
          });
        }
    , 1000);
    }
};
