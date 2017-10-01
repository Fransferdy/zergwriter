

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
        oldInfo.beats +=1;
        oldInfo.alive = 1;
        oldInfo.lastbeat =  nowInMs;
        serverWatchers[myaddress][myport] = oldInfo;
    }
    //console.log('W Entry:',serverWatchers[myaddress][myport]);
}

function cleanServerWatcher()
{
    let nowInMs = Date.now();
    let threemin = 15000;//milliss
    for(var key in serverWatchers) 
    {
        if (serverWatchers.hasOwnProperty(key))
        {
            let domain = serverWatchers[key];
            for(var key2 in domain)
            {
                if (domain.hasOwnProperty(key2))
                {
                    let lserver = domain[key2];
                    //console.log('look at this shit :',lserver);
                    if ((nowInMs-lserver.lastbeat) >threemin)
                    {
                        //console.log('Cleaning: ', lserver);
                        lserver.alive = 0;
                        serverWatchers[lserver.myaddress][lserver.myport] = lserver;
                    }
                }
            }
        }
    }
}

function getServerWatchers()
{
    let retwatchers = [];
    for(var key in serverWatchers) 
    {
        if (serverWatchers.hasOwnProperty(key))
        {
            let domain = serverWatchers[key];
            for(var key2 in domain) 
            {
                if (domain.hasOwnProperty(key2))
                {
                    let lwatcher = domain[key2];
                    if (lwatcher.alive)
                         retwatchers = retwatchers.concat(lwatcher);
                }
            }
        }
    }
    return retwatchers;
}


module.exports = {
    registerServerWatcher,
    getServerWatchers,
    cleanServerWatcher
};