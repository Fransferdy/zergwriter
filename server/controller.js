
var rp = require('request-promise');
var fs = require('fs');
var sqlite3 = require('sqlite3-promise');
//console.log(sqlite3);

var daddress = '';
var dport = '';
var myPort = '';
var myAddress = '';
var lastStamp = 0;

function init(daddressa,dporta,myAddressa,myPorta)
{
    daddress = daddressa;
    dport = dporta;
    myAddress = myAddressa;
    myPort = myPorta;
}
function heartBeat()
{
    console.log('Checking on Directory!');

    if (db!=null)
    {
        db.each("SELECT stamp FROM filedata ORDER BY stamp DESC LIMIT 1;", function(err, row) {
            lastStamp = row.stamp;
        });
    }else
    {
       lastStamp = 0; 
    }

    
    setTimeout(() => { // wait a bit to allow bd to return value
        clients.cleanClient();
        let amountClients = clients.getClients().length;
        var options = {
        method: 'POST',
        uri: daddress+':'+dport+'/serverbeat',
        body: {
            myAddress,
            myPort,
            data: {lastStamp,amountClients}
        },
        json: true // Automatically stringifies the body to JSON
    };

        rp(options)
        .then(function (htmlString) {
            console.log('Directory Succesfully Pinged');
            console.log(htmlString);
        })
        .catch(function (err) {
            console.log('Unable to Ping Directory, waiting for on more minute...');
        });
        }
    , 100);
};

function startDB()
{
  if (waitfordb)
    return;

  console.log('Checking DB File!');
  dbFileName = 'db'+myPort+'.db';
  if (fs.existsSync(dbFileName)) {
    console.log('Found!');
    db = new sqlite3.Database(dbFileName);
  }else
  {
      let options = {
      method: 'GET',
      uri: daddress+':'+dport+'/serverdb',
      body: {laststamp:0, myAddress, myPort},
      json: true // Automatically stringifies the body to JSON
    };

    waitfordb=true;
    rp(options)
      .then(function (htmlString) {
            let ob = htmlString;
            if (ob.status =='no known db')
            {
                console.log('No DB Found, creating a new one.');
                let dbstart = fs.readFileSync('dbstart.sql',"utf8");
                console.log(dbstart);
                db = new sqlite3.Database(dbFileName);
                db.exec(dbstart);
                waitfordb = false;
            }
            if (ob.status=='sending updated db')
            { }
      })
      .catch(function (err) {
          console.log(err);
          console.log('Unable to Ping Directory, waiting for on more minute...');
      });
  }
}

module.exports = {
    heartBeat,
    init,
    startDB
};