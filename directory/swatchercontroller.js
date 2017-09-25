

var serverWatchers = {};

function registerServerWatcher(myaddress, myport)
{
    let nowInMs = Date.now();
    if (serverWatchers[myaddress]==undefined)
        serverWatchers[myaddress] = [];
    let oldInfo = serverWatchers[myaddress][myport];
    if (oldInfo==undefined)
    {
        serverWatchers[myaddress][myport] = {beats:1, myaddress, myport,lastbeat:nowInMs, alive:1};
    }else
    {
        let beats = oldInfo.beats +1;
        serverWatchers[myaddress][myport] = {beats, myaddress, myport,lastbeat:nowInMs, alive:1};
    }
    console.log('W Entry:',serverWatchers[myaddress][myport]);
}

function cleanServerWatcher()
{
    let nowInMs = Date.now();
    let threemin = 180000;//milliss
    serverWatchers.forEach((domains) => {
        domains.forEach((watcher) =>{
            if ((nowInMs-watcher.lastbeat) >threemin)
            {
                let oldinfo = watcher;
                oldinfo.alive = 0;
                serverWatchers[oldinfo.myadress][oldinfo.myport] = oldinfo;
            }
        })
    });
}

function getServerWatchers()
{
    let watchers = [];
    serverWatchers.forEach((domains) => {
        domains.forEach((watcher) =>{
            if (watcher.alive)
                watchers.concat(watcher);
        })
    });
    
    return watchers;
}


module.exports = {
    registerServerWatcher,
    getServerWatchers
};