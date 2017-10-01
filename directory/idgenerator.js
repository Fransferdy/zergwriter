
var fs = require('fs');

var currid = {fid:1, blockid:0, sessionid:0};
var idfilename = 'ids.json';
function openJSON(filename)
{
    let str = fs.readFileSync(filename);
    let retob = JSON.parse(str);
    return retob;
}

function writeJSON(filename, ob)
{
    let str = JSON.stringify(ob);
    fs.writeFileSync(filename, str);
    let retob = JSON.parse(str);
    return retob;
}

if (fs.existsSync(idfilename)) 
{
    currid = openJSON(idfilename);
}
else
{
    currid = {fid:1, blockid:0, sessionid:0};
    writeJSON(idfilename,currid);
}

function getFileId()
{
    currid.fid++;
    writeJSON(idfilename,currid);
    return currid.fid;
}
function getBlockId()
{
    currid.blockid++;
    writeJSON(idfilename,currid);
    return currid.blockid;
}

function getFileSessionId()
{
    currid.sessionid++;
    writeJSON(idfilename,currid);
    return currid.sessionid;
}


module.exports = {
    getFileId,
    getFileSessionId,
    getBlockId
};