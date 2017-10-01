var rp = require('request-promise');

var clientBeatposthandler = async function (req, res) {
  //console.log('Received client heart beat: ',req.body);
  clients.registerClient(req.body.name, 0,req.body.data);
  clients.cleanClient();
  let otherclients = await dbs.getClientInFile(req.body.data.currfile.fileid);
  otherclients = otherclients.retlist;
  if (req.body.data.currfile.type==0)
  {//dir
    await dbs.updateFiles();
    let currdir = await dbs.getFile(req.body.data.currfile.fileid);
    let files = await dbs.getFilesByFatherId(req.body.data.currfile.fileid);
    res.send(JSON.stringify({ status: 'reloadfolder', currfile: currdir[0], files,otherclients }));
    return;
  }else
  {//file
    await dbs.updateFileData();
    let datablocks = await dbs.getFileDataByFatherId(req.body.data.currfile.fileid);
    res.send(JSON.stringify({ status: 'updateblocks',datablocks,otherclients }));
  }
}

var clientMakeFileDirposthandler = async function (req, res) {
  console.log('Received client create: ',req.body);
  await dbs.createFile(req.body.name,req.body.type,req.body.father);
  
  await dbs.updateFiles();
  let currdir = await dbs.getFile(req.body.father);
  let files = await dbs.getFilesByFatherId(req.body.father);
  res.send(JSON.stringify({ status: 'reloadfolder',currfile:currdir[0], files }));
}

var clientSaveDataposthandler = async function (req, res) {
  console.log('Received data create: ',req.body);

  let blocks = req.body.blocks;
  blocks = blocks.filter((elem) => { return elem.n; });
  let stampids = await dbs.getStampIds(blocks.length);
  for(let i=0; i<blocks.length;i++)
  {
    blocks[i].stamp = stampids.stamp;
    if (blocks[i].internalid==0)
      blocks[i].internalid = stampids.ids[i];
  }
  await dbs.saveData(blocks);

  res.send(JSON.stringify({ status: 'hello!', blocks }));

  //console.log(blocks);
  
}

var clientJoinposthandler = async function (req, res) {
  await dbs.updateFiles();
  let currfile =  await dbs.getFile(1);
  let files = await dbs.getFilesByFatherId(1);
  clients.registerClient(req.body.name, 0,{currfile, writepos:0});
  let message = { status: 'openfolder',currfile: currfile[0], files };
  //console.log(message);
  res.send(JSON.stringify(message));
}

var clientOpenFolderposthandler = async function (req, res) {
  await dbs.updateFiles();
  let currdir = await dbs.getFile(req.body.newdir);
  let files = await dbs.getFilesByFatherId(req.body.newdir);
  clients.registerClient(req.body.name, 0,{currfile:currdir[0], writepos:0});
  res.send(JSON.stringify({ status: 'openfolder',currfile:currdir[0], files }));
}

var clientOpenFileposthandler = async function (req, res) {
  await dbs.updateFiles();
  await dbs.updateFileData();
  let sessionId = await dbs.getSessionId();
  let currfile = await dbs.getFile(req.body.newfile);
  let datablocks = await dbs.getFileDataByFatherId(req.body.newfile);
  console.log('c file:',currfile);
  //console.log(' blocks:',datablocks);
  clients.registerClient(req.body.name, 0,{currfile, writepos:0});
  res.send(JSON.stringify({ status: 'openfile',currfile:currfile[0], datablocks,sessionId  }));
}



function getRoutes()
{
    return [
        {path:'/clientbeat',method:'post',handler:clientBeatposthandler},
        {path:'/opendir',method:'post',handler:clientOpenFolderposthandler},
        {path:'/openfile',method:'post',handler:clientOpenFileposthandler},
        {path:'/clientjoin',method:'post',handler:clientJoinposthandler},
        {path:'/makefiledir',method:'post',handler:clientMakeFileDirposthandler},
        {path:'/savedata',method:'post',handler:clientSaveDataposthandler}
    ];
}


module.exports = {
    getRoutes
};