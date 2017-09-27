var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var rp = require('request-promise');

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


var serverDbposthandler = function (req, res) {
  //console.log('Received server heart beat: ',req.body);
  if (db!=null)
    db.close();

  dbFileName = 'db'+myport+'.db';
  base64_decode(req.body.dbfile, dbFileName);
  db = new sqlite3.Database(dbFileName);
  res.send(JSON.stringify({ status: 'thanks' }));
  waitfordb=false;
}

var serverDbgethandler = function (req, res) { //receive {targetaddress, targetport} sends dbfile
    dbFileName = 'db'+myport+'.db';
    if (db==null)
    {
        res.send(JSON.stringify({ status: 'sorry' }));
        return;
    }
    let dbfile = base64_encode(dbFileName);
    let options = {
      method: 'POST',
      uri: req.body.targetaddress+':'+req.body.targetport+'/serverdb',
      body: {status:'you are welcome',dbfile},
      json: true // Automatically stringifies the body to JSON
    };

    rp(options)
      .then(function (htmlString) {
            let ob = htmlString;
            console.log(ob.status);
            res.send(JSON.stringify({ status: 'dbupdate sent to requesting server'}));
      })
      .catch(function (err) {
          console.log('failed to send db copy to fellow server');
          res.send(JSON.stringify({ status: 'failed to send dbupdate'}));
      });    
}

function getRoutes()
{
    return [
        {path:'/serverdb',method:'get',handler:serverDbgethandler},
        {path:'/serverdb',method:'post',handler:serverDbposthandler}
    ];
}


module.exports = {
    getRoutes
};