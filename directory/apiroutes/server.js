var rp = require('request-promise');

var serverBeatposthandler = function (req, res) {
  //console.log('Received server heart beat: ',req.body);
  res.send(JSON.stringify({ status: 'acknowledged' }));
  servercontrol.registerServer(req.body.myAddress, req.body.myPort,req.body.data);
}

var serverGetFidposthandler = function (req, res) {
  console.log('Received get fid: ',req.body);
  let stamp = Date.now();
  res.send(JSON.stringify({ id: genid.getFileId(), stamp }));
}

var serverGetSidgethandler = function (req, res) {
  console.log('Received get Sid: ',req.body);
  let stamp = Date.now();
  res.send(JSON.stringify({ id: genid.getFileSessionId(), stamp }));
}

var serverGetDataIdsgethandler = function (req, res) {
    console.log('Received get data ids: ',req.body);
    let stamp = Date.now();
    let ids = [];
    for(let i=0; i<req.body.amount; i++)
    {
        ids.push(genid.getBlockId());
    }
    res.send(JSON.stringify({ ids, stamp }));
}

var serverGetClientsFilegethandler = async function (req,res){
    let fileid = req.body.fileid;
    let servers = servercontrol.getServers();
    let otherserverdata = [];
    let retlist = [];
    //console.log('get client received:',req.body);
    for(let i=0; i<servers.length; i++)
    {
        let sfiles = {id:i};
        sfiles.data = await  rp({
        method: 'GET',
        uri: servers[i].myaddress+':'+servers[i].myport+'/getclients',
        body: {},
        json: true // Automatically stringifies the body to JSON
            }).then(function (jsonob) {
               return Promise.resolve(jsonob.clients);
            })
            .catch(function (err) {
                console.log(err);
                return Promise.resolve([]);
            });
        otherserverdata = otherserverdata.concat(sfiles);
    }
    for (let i=0;i<otherserverdata.length;i++)
    {
        let ofiles = otherserverdata[i].data;
        for (let j=0;j<ofiles.length;j++)
        {
            let otherclient = ofiles[j];
            if (otherclient.data.currfile.fileid==fileid)
                retlist = retlist.concat(otherclient);
        }
    }
    //console.log('RETLIST:',retlist);
    res.send(JSON.stringify({ status: 'clients', retlist }));
}

var serverUpdateFilesposthandler = async function (req,res){
    let retaddress = req.body.myAddress;
    let retport = req.body.myPort;
    let checkfiles = req.body.data.myfiledata;
    let servers = servercontrol.getServers();
    let otherserverdata = [];
    let retlist = [];
    //console.log('update request received:',req.body);
    //console.log('MyFiles:',checkfiles);
    for(let i=0; i<servers.length; i++)
    {
        if (servers[i].myaddress==retaddress && servers[i].myport==retport)
            continue;
        let sfiles = {id:i};
        sfiles.data = await  rp({
        method: 'GET',
        uri: servers[i].myaddress+':'+servers[i].myport+'/servergetallfiles',
        body: {},
        json: true // Automatically stringifies the body to JSON
            }).then(function (jsonob) {
               return Promise.resolve(jsonob.files);
            })
            .catch(function (err) {
                console.log(err);
                return Promise.resolve([]);
            });
        otherserverdata = otherserverdata.concat(sfiles);
    }
    
    let ihaveit=false;
    for (let i=0;i<otherserverdata.length;i++)
    {
        let ofiles = otherserverdata[i].data;
        //console.log('ofiles:',ofiles);
        for (let j=0;j<ofiles.length;j++)
        {
            let otherfile = ofiles[j];
            //console.log('otherfile:',otherfile);
            for (let k=0;k<checkfiles.length;k++)
            {
               // console.log('checkfile:',checkfiles[k]);
                if (checkfiles[k].filename == otherfile.filename && checkfiles[k].father == otherfile.father)
                {
                    ihaveit = true;
                    if (checkfiles[k].stamp === otherfile.stamp)
                        continue;
                    if (checkfiles[k].stamp < otherfile.stamp)
                        retlist = retlist.concat(otherfile); 
                }
            }
            if (ihaveit==false)
                retlist = retlist.concat(otherfile);
            ihaveit=false;
        }
    }
    if (retlist.length==0)
         res.send(JSON.stringify({ status: 'uptodate', retlist:[] }));
    else
        res.send(JSON.stringify({ status: 'needupdate', retlist }));
}



var serverUpdateFileDataposthandler = async function (req,res){
    let retaddress = req.body.myAddress;
    let retport = req.body.myPort;
    let checkfiles = req.body.data.myfiledata;
    let servers = servercontrol.getServers();
    let otherserverdata = [];
    let retlist = [];
    //console.log('update request received:',req.body);
    //console.log('MyFiles:',checkfiles);
    for(let i=0; i<servers.length; i++)
    {
        if (servers[i].myaddress==retaddress && servers[i].myport==retport)
            continue;
        let sfiles = {id:i};
        //console.log();
        sfiles.data = await rp({
        method: 'GET',
        uri: servers[i].myaddress+':'+servers[i].myport+'/servergetallfiledata',
        body: {},
        json: true // Automatically stringifies the body to JSON
            }).then(function (jsonob) {
               return Promise.resolve(jsonob.files);
            })
            .catch(function (err) {
                //console.log(err);
                return Promise.resolve([]);
            });
        otherserverdata = otherserverdata.concat(sfiles);
    }
    
    let ihaveit=false;
    for (let i=0;i<otherserverdata.length;i++)
    {
        let ofiles = otherserverdata[i].data;
        //console.log('ofiles:',ofiles);
        for (let j=0;j<ofiles.length;j++)
        {
            let otherfile = ofiles[j];
            //console.log('otherfile:',otherfile);
            for (let k=0;k<checkfiles.length;k++)
            {
                //console.log('checkfile:',checkfiles[k]);
                if (checkfiles[k].fileblockid == otherfile.fileblockid)
                {
                    ihaveit = true;
                    if (checkfiles[k].stamp === otherfile.stamp)
                        continue;
                    if (checkfiles[k].stamp < otherfile.stamp)
                        retlist = retlist.concat(otherfile); 
                }
            }
            if (ihaveit==false)
                retlist = retlist.concat(otherfile);
            ihaveit=false;
        }
    }
    if (retlist.length==0)
         res.send(JSON.stringify({ status: 'uptodate', retlist:[] }));
    else
        res.send(JSON.stringify({ status: 'needupdate', retlist }));
}

var serverDbgethandler = function (req, res) {
  let servers = servercontrol.getServers();
  let chosenServer = null;
  let targetaddress = req.body.myAddress;
  let targetport= req.body.myPort;
  //console.log(servers);
  for(let i=0; i<servers.length; i++)
    {
        if (servers[i].data.lastStamp>0)
        {
            chosenServer = servers[i];
            break;
        }
    }
    if (chosenServer==null)
    {
        console.log('No db availiable, start your own',req.body);
        res.send(JSON.stringify({ status: 'no known db' }));
    }else
    {
        //console.log(chosenServer);
        let options = {
        method: 'GET',
        uri: chosenServer.myaddress+':'+chosenServer.myport+'/serverdb',
        body: {targetaddress, targetport},
        json: true // Automatically stringifies the body to JSON
        };

        rp(options)
        .then(function (htmlString) {
                let ob = htmlString;
                //console.log(ob.status);
                if (ob.status == 'failed to send dbupdate')
                    res.send(JSON.stringify({ status: 'no known db'}));
                else
                    res.send(JSON.stringify({ status: 'sending updated db'}));
        })
        .catch(function (err) {
            //console.log('failed to send db copy to fellow server');
            res.send(JSON.stringify({ status: 'no known db'}));
        });
    }
    
}



var serverDirStatusgethandler = function (req, res) {
  let servers = servercontrol.getServers();
  let watchers = sw.getServerWatchers();
  res.send(JSON.stringify({ status: 'hello!',servers,watchers}));
}

function getRoutes()
{
    return [
        {path:'/serverbeat',method:'post',handler:serverBeatposthandler},
        {path:'/status',method:'get',handler:serverDirStatusgethandler},
        {path:'/getfid',method:'post',handler:serverGetFidposthandler},
        {path:'/getsid',method:'get',handler:serverGetSidgethandler},
        {path:'/getclientsfile',method:'get',handler:serverGetClientsFilegethandler},
        {path:'/getdataids',method:'get',handler:serverGetDataIdsgethandler},
        {path:'/serverdb',method:'get',handler:serverDbgethandler},
        {path:'/serverupdatefiles',method:'post',handler:serverUpdateFilesposthandler},
        {path:'/serverupdatefiledata',method:'post',handler:serverUpdateFileDataposthandler}
    ];
}


module.exports = {
    getRoutes
};