var rp = require('request-promise');

function getAllFiles()
{
    if (db==undefined)
        return;
    return db.allAsync('SELECT * FROM file;');
}

function getAllFileData()
{
    if (db==undefined)
        return;
    return db.allAsync('SELECT * FROM filedata ;');
}

function updateFileData()
{
    if (db==undefined)
        return;
    return getAllFileData().then( (myfiledata) =>{
    return rp({
        method: 'POST',
        uri: directoryaddress+':'+directoryport+'/serverupdatefiledata',
        body: {
            myAddress:myaddress,
            myPort:myport,
            data: {myfiledata}
        },
        json: true // Automatically stringifies the body to JSON
            }).then(async function (ob) {
            //console.log(ob);
            if (ob.status=='uptodate')
            {
                console.log('Server filedata is up to date');
                return Promise.resolve(true);
            }
            for (let i=0;i<ob.retlist.length;i++)
            {
                let file = ob.retlist[i];
                await db.runAsync('insert or replace into filedata (internalid, fileblockid, ownerfile, data, stamp,nextblock,backblock,size) values ('+file.internalid+', '+file.fileblockid+', '+file.ownerfile+', "'+file.data+'", '+file.stamp+', '+file.nextblock+', '+file.backblock+', '+file.size+' );')
            }
                console.log('Server FileData Succesfully Updated');
                return Promise.resolve(true);
            })
            .catch(function (err) {
                console.log(err);
                console.log('Server Failed to Update FileData');
            });} );
        
}

function updateFiles()
{
    if (db==undefined)
        return;
    return getAllFiles().then( (myfiledata) =>{
    return rp({
        method: 'POST',
        uri: directoryaddress+':'+directoryport+'/serverupdatefiles',
        body: {
            myAddress:myaddress,
            myPort:myport,
            data: {myfiledata}
        },
        json: true // Automatically stringifies the body to JSON
            }).then(async function (ob) {
                
            if (ob.status=='uptodate')
            {
                console.log('Server is up to date');
                return Promise.resolve(true);
            }
            for (let i=0;i<ob.retlist.length;i++)
            {
                let file = ob.retlist[i];
                await db.runAsync('insert or replace into file (fileid, filename, type, stamp, father) values ('+file.fileid+', "'+file.filename+'", '+file.type+', '+file.stamp+', '+file.father+' );')
            }
                console.log('Server Succesfully Updated');
                return Promise.resolve(true);
            })
            .catch(function (err) {
                console.log(err);
                console.log('Server Failed to Update');
            });} );
        
}

function createFile(name,type,father)
{
    if (db==undefined)
        return;
    var iname = name;
    var itype = type;
    var ifather = father;
return rp({
        method: 'POST',
        uri: directoryaddress+':'+directoryport+'/getfid',
        body: {
        },
        json: true // Automatically stringifies the body to JSON
            }).then(async function (ob) {
            //console.log('SQL : ','insert or replace into file (fileid, filename, type, stamp, father) values ('+ob.id+', "'+iname+'", '+itype+', '+ob.stamp+', '+ifather+' );');
            await db.runAsync('insert or replace into file (fileid, filename, type, stamp, father) values ('+ob.id+', "'+iname+'", '+itype+', '+ob.stamp+', '+ifather+' );');
        return Promise.resolve(true);    
        })
            .catch(function (err) {
                //console.log(err);
                console.log('Server Failed to Update');
                return Promise.resolve(false);
            });
}


function getSessionId()
{
return rp({
        method: 'GET',
        uri: directoryaddress+':'+directoryport+'/getsid',
        body: {
        },
        json: true // Automatically stringifies the body to JSON
            }).then(function (ob) {
           return Promise.resolve(ob.id);  
        })
            .catch(function (err) {
                //console.log(err);
                console.log('Server Failed to Get Session ID');
                return Promise.resolve(false);
            });
}


function getStampIds(amount)
{
return rp({
        method: 'GET',
        uri: directoryaddress+':'+directoryport+'/getdataids',
        body: {amount
        },
        json: true // Automatically stringifies the body to JSON
            }).then(function (ob) {
           return Promise.resolve(ob);  
        })
            .catch(function (err) {
                //console.log(err);
                console.log('Server Failed to Get Data Ids');
                return Promise.resolve(false);
            });
}

function getClientInFile(fileid)
{
return rp({
        method: 'GET',
        uri: directoryaddress+':'+directoryport+'/getclientsfile',
        body: {fileid
        },
        json: true // Automatically stringifies the body to JSON
            }).then(function (ob) {
           return Promise.resolve(ob);  
        })
            .catch(function (err) {
                //console.log(err);
                console.log('Server Failed to Get Client in File');
                return Promise.resolve(false);
            });
}

async function saveData(blocks)
{
    if (db==undefined)
        return;
    for(let i=0; i<blocks.length; i++)
    {
        //console.log('SQL COMMAND:','insert or replace into filedata (internalid, fileblockid, ownerfile, data, stamp,nextblock,backblock,size) values ('+blocks[i].internalid+', "'+blocks[i].fileblockid+'", '+blocks[i].ownerfile+', '+blocks[i].data+', '+blocks[i].stamp+', '+blocks[i].nextblock+', '+blocks[i].backblock+', '+blocks[i].size+' );');
       await db.runAsync('insert or replace into filedata (internalid, fileblockid, ownerfile, data, stamp,nextblock,backblock,size) values ('+blocks[i].internalid+', '+blocks[i].fileblockid+', '+blocks[i].ownerfile+', "'+blocks[i].data+'", '+blocks[i].stamp+', '+blocks[i].nextblock+', '+blocks[i].backblock+', '+blocks[i].size+' );');
    }
}

function getFile(fileid){
    if (db==undefined)
        return;
    return db.allAsync('SELECT * FROM file WHERE fileid='+fileid+';');
}

function getFilesByFatherId(fileid)
{
    if (db==undefined)
        return;
    return db.allAsync('SELECT * FROM file WHERE father='+fileid+';');
}

function getFileDataByFatherId(fileid)
{
    if (db==undefined)
        return;
    return db.allAsync('SELECT * FROM filedata WHERE ownerfile='+fileid+' ORDER BY fileblockid ASC;');
}




module.exports = {
    getFile,
    getFilesByFatherId,
    updateFiles,
    getAllFiles,
    createFile,
    updateFileData,
    getSessionId,
    getAllFileData,
    getFileDataByFatherId,
    getStampIds,
    saveData,
    getClientInFile
};