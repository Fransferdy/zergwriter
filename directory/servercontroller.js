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
        servers[myaddress][myport] = oldInfo;
    }
    console.log('S Entry:',servers[myaddress][myport]);
}

function cleanServer()
{
    let nowInMs = Date.now();
    let threemin = 180000;//milliss

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
                    console.log('look at this shit :',lserver);
                    if ((nowInMs-lserver.lastbeat) >threemin)
                    {
                        lserver.alive = 0;
                        servers[lserver.myadress][lserver.myport] = lserver;
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


module.exports = {
    registerServer,
    getServers
};