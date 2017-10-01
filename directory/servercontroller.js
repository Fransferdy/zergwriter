var rp = require('request-promise');

var servers = {};

function registerServer(myaddress, myport, data)
{
    let nowInMs = Date.now();
    if (servers[myaddress]==undefined)
        servers[myaddress] = [];
    let oldInfo = servers[myaddress][myport];
    if (oldInfo==undefined)
    {
        servers[myaddress][myport] = {beats:1, myaddress, myport,lastbeat:nowInMs, alive:1, data};
    }else
    {
        oldInfo.beats +=1;
        oldInfo.data = data;
        oldInfo.alive = 1;
        oldInfo.lastbeat =  nowInMs;
        servers[myaddress][myport] = oldInfo;
    }
    //console.log('S Entry:',servers[myaddress][myport]);
}

function cleanServer()
{
    let nowInMs = Date.now();
    let onehalfmin = 15000;//milliss

    for(var key in servers) 
    {
        if (servers.hasOwnProperty(key))
        {
            let domain = servers[key];
            for(var key2 in domain)
            {
                if (domain.hasOwnProperty(key2))
                {
                    let lserver = domain[key2];
                    //console.log('look at this shit :',lserver);
                    if ((nowInMs-lserver.lastbeat) >onehalfmin)
                    {
                        //console.log('Cleaning: ', lserver);
                        lserver.alive = 0;
                        servers[lserver.myaddress][lserver.myport] = lserver;
                    }
                }
            }
        }
    }

}

function getServers()
{
    let retservers = [];
    for(var key in servers) 
    {
        if (servers.hasOwnProperty(key))
        {
            let domain = servers[key];
            for(var key2 in domain) 
            {
                if (domain.hasOwnProperty(key2))
                {
                    let lserver = domain[key2];
                    if (lserver.alive)
                         retservers = retservers.concat(lserver);
                }
            }
        }
    }
    return retservers;
}

function sendServerKillMessage(address, port)
{
    let options = {
    method: 'POST',
    uri: address+':'+port+'/serverkill',
    body: {},
    json: true // Automatically stringifies the body to JSON
    };

    rp(options)
    .then(function (htmlString) {
            let ob = htmlString;
            //console.log(ob.status);
            if (ob.status == 'turning myself off...')
                servers[address][port].alive = 0;
    })
    .catch(function (err) {
        console.log('Failed To send kill message');
    });
}

function sendWatcherStartServerMessage(address, port)
{
    let options = {
    method: 'POST',
    uri: address+':'+port+'/spawn',
    body: {amount:1, diraddress: directoryaddress,dirport: directoryport},
    json: true // Automatically stringifies the body to JSON
    };

    rp(options)
    .then(function (htmlString) {
            let ob = htmlString;
            console.log(ob.status);
    })
    .catch(function (err) {
        console.log('Failed To send start message');
    });
}

function balanceServers()
{
    let lservers = getServers();
    let lswatchers = sw.getServerWatchers();
    let amountUsers = 0;
    let totalCapacity = serverCapacity * lservers.length;
    

    lservers.forEach((elem) => {amountUsers += elem.data.amountClients});
    if (amountUsers > totalCapacity || lservers.length < 2)
    {
        console.log('Need more servers, up scaling...');
        if (lswatchers.length==0)
        {
            console.log('Unable to upscale, no server watcher found...');
            return;
        }
        let rest = amountUsers-totalCapacity;
        let newServers = Math.ceil(rest/serverCapacity);
        if (lservers.length<2 && newServers <2)
            newServers = 2;
        while(newServers>0)
        {
            lswatchers.forEach((elem) => {
                if (newServers>0)
                {
                    console.log('Server Create Sent');
                    sendWatcherStartServerMessage(elem.myaddress, elem.myport);
                    newServers--;
                }
            });
        }
    }
    if (amountUsers < totalCapacity)
    {
        let destroyableServers = lservers.length -2;
        if (destroyableServers>0)
        {
            console.log('Need less servers, down scaling...');
            lservers.forEach((elem) => {
                if (destroyableServers>0)
                {
                    if (elem.data.amountClients==0)
                    {
                        console.log('Server Kill Sent');
                        sendServerKillMessage(elem.myaddress, elem.myport);
                        destroyableServers--;
                    }
                }
            });
        }
    }
}


module.exports = {
    cleanServer,
    registerServer,
    getServers,
    balanceServers
};