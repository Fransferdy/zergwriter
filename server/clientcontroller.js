var clients = {};

function registerClient(myname, myid, data)
{
    let nowInMs = Date.now();
    if (clients[myname]==undefined)
        clients[myname] = [];
    let oldInfo = clients[myname][myid];
    if (oldInfo==undefined)
    {
        clients[myname][myid] = {beats:1, updates: [], myname, myid,lastbeat:nowInMs, alive:1, data};
    }else
    {
        oldInfo.beats +=1;
        oldInfo.data = data;
        oldInfo.alive =1;
        oldInfo.lastbeat = nowInMs;
        clients[myname][myid] = oldInfo;
    }
   // console.log('C Entry:',clients[myname][myid]);
}

function cleanClient()
{
    let nowInMs = Date.now();
    let onemin = 6000;//milliss

    for(var key in clients) 
    {
        if (clients.hasOwnProperty(key))
        {
            let cname = clients[key];
            for(var key2 in cname) 
            {
                if (cname.hasOwnProperty(key2))
                {
                    let lclient = cname[key2];
                    //console.log('look at this shit :',lclient);
                    if ((nowInMs-lclient.lastbeat) >onemin)
                    {
                        lclient.alive = 0;
                        clients[lclient.myname][lclient.myid] = lclient;
                    }
                }
            }
        }
    }

}

function getClients()
{
    let retclients = [];
    for(var key in clients) 
    {
        if (clients.hasOwnProperty(key))
        {
            let cname = clients[key];
            for(var key2 in cname) 
            {
                if (cname.hasOwnProperty(key2))
                {
                    let lclient = cname[key2];
                    if (lclient.alive)
                         retclients = retclients.concat(lclient);
                }
            }
        }
    }
    return retclients;
}


module.exports = {
    registerClient,
    getClients,
    cleanClient
};