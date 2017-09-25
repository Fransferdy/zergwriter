var servers = {};

function registerServer(myaddress, myport)
{
    let nowInMs = Date.now();
    if (servers[myaddress]==undefined)
        servers[myaddress] = [];
    let oldInfo = servers[myaddress][myport];
    if (oldInfo==undefined)
    {
        servers[myaddress][myport] = {beats:1, myaddress, myport,lastbeat:nowInMs, alive:1};
    }else
    {
        oldInfo.beats +=1;
        servers[myaddress][myport] = oldInfo;
    }
    console.log('S Entry:',servers[myaddress][myport]);
}

function cleanServer()
{
    let nowInMs = Date.now();
    let threemin = 180000;//milliss
    servers.forEach((domains) => {
        domains.forEach((watcher) =>{
            if ((nowInMs-watcher.lastbeat) >threemin)
            {
                let oldinfo = watcher;
                oldinfo.alive = 0;
                servers[oldinfo.myadress][oldinfo.myport] = oldinfo;
            }
        })
    });
}

function getServers()
{
    let watchers = [];
    servers.forEach((domains) => {
        domains.forEach((watcher) =>{
            if (watcher.alive)
                watchers.concat(watcher);
        })
    });

    return watchers;
}


module.exports = {
    registerServer,
    getServers
};