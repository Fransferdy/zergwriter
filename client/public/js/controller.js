
var daddress = 'http://localhost';
var dport = 3001;

function renderError()
{
    let error = '<div class="container">' +
      '<h1>Unable to connect to server</h1>'+
    '</div> <!-- /container -->';

    $('#contentbox').html(error);
};
function renderLogin()
{   
    let login = '<div class="container">' +
        '<h2 class="form-signin-heading">Login ZergWriter</h2>' +
        '<input type="text" id="nome" class="form-control" placeholder="Nome" required autofocus>' +
        '<a onClick="callControllerLogin()" class="btn btn-lg btn-primary btn-block" >Entrar</a>' +
    '</div> <!-- /container -->';

    $('#contentbox').html(login);
};


function renderDirOptions(){
    let fatherdir = -1;
    fatherdir=controller.currfile.father;
    if (fatherdir==-1)
        fatherdir=1;
    let diroptions = '<div class="row">' +
    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
     '<input type="text" id="fnome" class="form-control" placeholder="File Name" required autofocus>' +
    '</div>  ' +
    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
     '<a onClick="callControllerMakeDir()" class="btn btn-lg btn-primary btn-block" >Criar Diretorio</a>' +
    '</div>  ' +
    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
     '<a onClick="callControllerMakeFile()" class="btn btn-lg btn-primary btn-block" >Criar Arquivo</a>' +
    '</div>  ' +
    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
     '<a onClick="controller.opendir('+fatherdir+')" class="btn btn-lg btn-primary btn-block" >Voltar um Nivel</a>' +
    '</div>  ' +
    '</div>'   ;
    $('#navbox').html(diroptions);

};

function renderDir()
{
    let dir = '<div class="container"> <h3>Contents of '+controller.currfile.filename+' </h3>'+
    '<div class="row">';
    for(var i=0; i< controller.files.length;i++)
    {
        var tfile = controller.files[i];
        var type='';
        var img = '';
        var onClick = 'onClick="callControllerMakeDir()"';
        if (tfile.type==0)
        {
            img = '<img src="./imgs/folder.png"></img> <br>';
            onClick = 'onClick="controller.opendir('+tfile.fileid+')"';
        }
        else
        {
            img = '<img src="./imgs/file.png"></img> <br>';
            onClick = 'onClick="controller.openfile('+tfile.fileid+')"';
        }
        dir+= '<div '+onClick+' class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
        '<div id="f'+i+'" class="btn btn-lg btn-primary btn-block">' +
        img+
        tfile.filename +
        '</div>  '+
        '</div>  ';
    }
    dir +='</div> </div>';
    $('#contentbox').html(dir);
};

function renderFileOptions(){
    let fatherdir = -1;
    fatherdir=controller.currfile.father;
    if (fatherdir==-1)
        fatherdir=1;
    let diroptions = '<div class="row">' +
    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
     '<a onClick="controller.opendir('+fatherdir+')" class="btn btn-lg btn-primary btn-block" >Voltar um Nivel</a>' +
    '</div>  ' +
    '</div>'   ;
    $('#navbox').html(diroptions);
};

function renderFile(){
    let file = '<div class="container"> <h3>Contents of '+controller.currfile.filename+' </h3>'+
        '<div class="editarea"> '+getTextFromBlocks()+' </div></div>';


    $('#contentbox').html(file);
};

function renderOtherUsers(otherusers){
    if (!otherusers)
        return;

    let file = '<div class="container"> <p>Usuários neste arquivo: '

    for(var i=0; i<otherusers.length;i++)
    {
        file+=otherusers[i].myname+', ';
    }
    file+=' </p> </div>';


    $('#clientbox').html(file);
};

function callControllerMakeDir(){
    let name = $('#fnome').val();
    if (name!='')
        controller.makeFileDir(name,0);
    else
        console.log('we need a name for the file/dir');
}

function callControllerMakeFile(){
    let name = $('#fnome').val();
    if (name!='')
        controller.makeFileDir(name,1);
    else
        console.log('we need a name for the file/dir');
}

function callControllerLogin(){
    let name = $('#nome').val();
    let color = 'blue';
    if (name!='')
        controller.login(name,color);
    else
        console.log('we need a name to connect');
}

var controller = {
    serveraddress: '',
    serverport: 0,
    name: '',
    color: 'blue',
    writepos: 0,
    currfile: {},
    files: [],
    sessionId: 0,
    scount:0,
    actualblock:0,
    datablocks:[],
    start: function (){
        $.ajax
		 ({
            type: 'POST',
            url: (daddress+':'+dport+'/clientjoin'),
            data: JSON.stringify({}),
            success: function (response)
			{
				var retval =	JSON.parse( response );
				if (retval.status!="ok")
                {
                    console.log(retval.status);
                    renderError();
                    return;	
                }
                console.log(response);
                controller.serveraddress = retval.address;
                controller.serverport = retval.port;
				renderLogin();	
            },
            error: function ()
            {
                renderError();
            }
          });
    },
    recover: function (){
        $.ajax
		 ({
            type: 'POST',
            url: (daddress+':'+dport+'/clientjoin'),
            data: JSON.stringify({}),
            success: function (response)
			{
				var retval =	JSON.parse( response );
				if (retval.status!="ok")
                {
                    console.log(retval.status);
                    renderError();
                    return;	
                }
                console.log(response);
                controller.serveraddress = retval.address;
                controller.serverport = retval.port;	
            },
            error: function ()
            {
                renderError();
            }
          });
    },

    login: function(name,color){
        $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/clientjoin'),
            data: JSON.stringify({name}),
            success: function (response)
			{
                var retval =	JSON.parse( response );
                
				if (retval.status!="openfolder")
                {
                    console.log(retval.status);
                    renderError();
                    return;	
                }
                //retval.files
                controller.name = name;
                controller.color = color;
                controller.currfile = retval.currfile;
                controller.writepos=0;
                controller.files = retval.files;
                renderDirOptions();
                renderDir();
                controller.heartBeat();
                console.log(retval);
            },
            error: function ()
            {
                controller.recover();
            }
          });
    },
    opendir: function(fid){
        $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/opendir'),
            data: JSON.stringify({name:controller.name,newdir:fid}),
            headers     : { 'Content-Type': 'application/json' },
            success: function (response)
			{
                var retval =	JSON.parse( response );
                
				if (retval.status!="openfolder")
                {
                    console.log(retval.status);
                    renderError();
                    return;	
                }
                controller.currfile = retval.currfile;
                controller.writepos=0;
                controller.files = retval.files;
                $(document).keydown(() => {});
                $(document).keypress(() => {});

                renderDirOptions();
                renderDir();
                console.log(retval);
            },
            error: function ()
            {
                controller.recover();
            }
          });
    },
    openfile: function(fid){
        $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/openfile'),
            data: JSON.stringify({name:controller.name,newfile:fid}),
            headers     : { 'Content-Type': 'application/json' },
            success: function (response)
			{
                var retval =	JSON.parse( response );
                console.log(retval);
				if (retval.status!="openfile")
                {
                    console.log(retval.status);
                    renderError();
                    return;	
                }
                controller.currfile = retval.currfile;
                controller.sessionId = retval.sessionId;
                controller.writepos=0;
                controller.files = retval.files;
                controller.datablocks = retval.datablocks;
                controller.scount = 0;
                controller.actualblock=0;
                for(var i=0; i<retval.datablocks.length; i++)
                {
                    if (retval.datablocks[i].backblock==0)
                        {
                            controller.actualblock = retval.datablocks[i].fileblockid;
                            break;
                        }
                }
                renderFileOptions();
                renderFile();
                console.log(retval);
            },
            error: function ()
            {
                controller.recover();
            }
          });
    },
    heartBeat: function()
    {
        setTimeout(() => { // wait a bit to allow bd to return value
        var senddata = {name:controller.name,data:{color:controller.color,currfile:controller.currfile,writepos:controller.writepos}};
            $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/clientbeat'),
            data: JSON.stringify(senddata),
            headers     : { 'Content-Type': 'application/json' },
            success: function (response)
			{
                var retval =	JSON.parse( response );
                if (retval.status=='reloadfolder')
                {
                    controller.currfile = retval.currfile;
                    controller.files = retval.files;
                    renderDir();
                }
                if (retval.status=='updateblocks')
                {
                    let ihaveit=false;
                    console.log(retval);
                    for(var i=0; i<retval.datablocks.length; i++)
                    {
                        for(var k=0; k<controller.datablocks.length; k++)
                        {
                            if (retval.datablocks[i].fileblockid == controller.datablocks[k].fileblockid)
                            {
                                console.log('match, file block!');
                                ihaveit=true;
                                if (controller.datablocks[k].internalid==0)
                                    continue;
                                if (retval.datablocks[i].stamp>controller.datablocks[k].stamp)
                                {
                                    
                                    controller.datablocks[k] = retval.datablocks[i];
                                    break;
                                }
                            }
                        }
                        if (ihaveit==false)
                            controller.datablocks.push(retval.datablocks[i]);
                        ihaveit=false;
                    }
                    if (controller.actualblock==0)    
                    {
                        for(var i=0; i<retval.datablocks.length; i++)
                        {
                            if (retval.datablocks[i].backblock==0)
                                {
                                    controller.actualblock = retval.datablocks[i].fileblockid;
                                    break;
                                }
                        }
                    }

                    renderFile();
                }

                renderOtherUsers(retval.otherclients);
                console.log(retval);
                controller.heartBeat();
            },
            error: function (err)
            {
                controller.recover();
                controller.heartBeat();
            }
          });
        }
    , 2000);
    },
    makeFileDir: function(name,type){
        for(var i=0; i<controller.files.length;i++)
        {
            if (name==controller.files[i].filename)
            {
                console.log('unable to create file, name already used!!');
                return;
            }
        };  
        $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/makefiledir'),
            headers     : { 'Content-Type': 'application/json' },
            data: JSON.stringify({name, type, father:controller.currfile.fileid}),
            success: function (response)
			{
                var retval =	JSON.parse( response );
                console.log(retval);
				controller.currfile = retval.currfile;
                controller.writepos=0;
                controller.files = retval.files;
                renderDir();
                console.log(retval);
            },
            error: function ()
            {
                controller.recover();
            }
          });
    },

};

function insertBlock()
{
    let blockiid = (controller.sessionId*3000)+controller.scount;
    let backblock = controller.actualblock;
    if (backblock==undefined)
        backblock = 0;
    controller.scount++;
    controller.datablocks[controller.datablocks.length] = {
        internalid:0,
        fileblockid:blockiid,
        ownerfile:controller.currfile.fileid,
        data: '',
        stamp:0,
        nextblock:-1,
        backblock:backblock,
        size:0,
        n:true
    };
    
}

var sendWait=false;
function setSendData()
{
    if (sendWait==false)
    {
        sendWait = true;
        setTimeout(()=>{
            sendWait = false;
        $.ajax
		 ({
            type: 'POST',
            url: (controller.serveraddress+':'+controller.serverport+'/savedata'),
            headers     : { 'Content-Type': 'application/json' },
            data: JSON.stringify({blocks:controller.datablocks}),
            success: function (response)
			{
                var ob =	JSON.parse( response );
                ob = ob.blocks;
                for(var i=0; i<ob.length; i++)
                {
                    for(var k=0; k<controller.datablocks.length; k++)
                    {
                        if (ob[i].fileblockid==controller.datablocks[k].fileblockid)
                        {
                            controller.datablocks[k].stamp = ob[i].stamp;
                            controller.datablocks[k].internalid = ob[i].internalid;
                        }
                    }
                }
                console.log(ob);
            },
            error: function ()
            {
                controller.recover();
            }
          });
        setTimeout(()=>{
            for(var k=0; k<controller.datablocks; k++)
            {
                controller.datablocks[k].n=false;
            }
        },10);
        }, 2000);
    }
}

function getBlockPosByBlockId(blockid)
{
    var i = 0;
    for(i=0; i < controller.datablocks.length; i++)
    {
        if (controller.datablocks[i].fileblockid==blockid)
            return i;
    }
}

function getTextFromBlocks()
{
    if (controller.datablocks.length==0)
        return '';
    let block = controller.datablocks[0];
    let text = '';
    while(true)
    {
        if (controller.actualblock!=block.fileblockid)
            text+=block.data;
        else
            {
                let t1 = block.data.substr(0,controller.writepos);
                let t2 = block.data.substr(controller.writepos);
                text+=t1;
                text+='|';
                text+=t2;
            }
        if (block.nextblock==-1)
            break;
        block = controller.datablocks[getBlockPosByBlockId(block.nextblock)];
    }
    return text;
}


function treatChars(e)
{
    if (controller.currfile.type==0 || controller.currfile.type==undefined)
        return;
let key = e.key;
insertCharacterIntoBlocks(key);
}

function insertCharacterIntoBlocks(key)
{
if (controller.datablocks.length==0)
{
    console.log('Creating First');
    insertBlock();
    controller.actualblock = controller.datablocks[0].fileblockid;
}
if (controller.writepos==31)
{
    console.log('Creating Next Block');
    insertBlock();
    let oldnext = controller.datablocks[getBlockPosByBlockId(controller.actualblock)].nextblock;
    controller.datablocks[getBlockPosByBlockId(controller.actualblock)].n = true;
    controller.datablocks[getBlockPosByBlockId(controller.actualblock)].nextblock = controller.datablocks[controller.datablocks.length-1].fileblockid;
    controller.actualblock = controller.datablocks[controller.datablocks.length-1].fileblockid;
    controller.datablocks[getBlockPosByBlockId(controller.actualblock)].nextblock = oldnext;
    controller.datablocks[getBlockPosByBlockId(controller.actualblock)].n = true;
    controller.writepos=0;
}

let blockpos = getBlockPosByBlockId(controller.actualblock);
if (controller.writepos<controller.datablocks[blockpos].size)
{
    console.log('Splitting Block, Size:',controller.datablocks[blockpos].size, ' POS: ', controller.writepos);
    let diff = controller.datablocks[blockpos].size - controller.writepos;
    let olddata = controller.datablocks[blockpos].data.substr(0,controller.writepos);
    let newdata = controller.datablocks[blockpos].data.substr(controller.writepos);
    controller.datablocks[blockpos].n = true;
    controller.datablocks[blockpos].data = olddata;
    controller.datablocks[blockpos].size = controller.writepos;
    insertBlock();
    if (controller.datablocks[blockpos].nextblock!=-1)
    {
        let blockpos2 = getBlockPosByBlockId(controller.datablocks[blockpos].nextblock);
        controller.datablocks[blockpos2].n = true;
        controller.datablocks[blockpos2].backblock = controller.datablocks[controller.datablocks.length-1].fileblockid;
    }
    controller.datablocks[controller.datablocks.length-1].n = true;
    controller.datablocks[controller.datablocks.length-1].nextblock = controller.datablocks[blockpos].nextblock;
    controller.datablocks[blockpos].n = true;
    controller.datablocks[blockpos].nextblock = controller.datablocks[controller.datablocks.length-1].fileblockid;
    controller.datablocks[controller.datablocks.length-1].n = true;
    controller.datablocks[controller.datablocks.length-1].data = newdata;
    controller.datablocks[controller.datablocks.length-1].size = newdata.length;
}
controller.datablocks[blockpos].n = true;
controller.datablocks[blockpos].data+=key;
controller.datablocks[blockpos].size=controller.datablocks[blockpos].data.length;
controller.writepos++;
setSendData();
renderFile();
//console.log(key);
}

function blockDeleteCharBack()
{
let blockpos = getBlockPosByBlockId(controller.actualblock);
if (controller.writepos > controller.datablocks[blockpos].size)
    controller.writepos = controller.datablocks[blockpos].size;

if (controller.writepos==0)
{
    if (controller.datablocks[blockpos].backblock==0)
        return;
    console.log('Going to previous block');
    controller.actualblock = controller.datablocks[blockpos].backblock;
    blockpos = getBlockPosByBlockId(controller.actualblock);
    controller.writepos = controller.datablocks[blockpos].size;
}
blockpos = getBlockPosByBlockId(controller.actualblock);

let t1 = controller.datablocks[blockpos].data.substr(0,controller.writepos-1);
let t2 = controller.datablocks[blockpos].data.substr(controller.writepos);
controller.datablocks[blockpos].data = t1+t2;
controller.datablocks[blockpos].size = controller.datablocks[blockpos].data.length;
controller.writepos--;
controller.datablocks[blockpos].n=true;
setSendData();
renderFile();
}

function moveLeft()
{
let blockpos = getBlockPosByBlockId(controller.actualblock);
if (controller.writepos > controller.datablocks[blockpos].size)
    controller.writepos = controller.datablocks[blockpos].size;

if (controller.writepos==0)
{
    if (controller.datablocks[blockpos].backblock==0)
        return;
    console.log('Going to previous block');
    controller.actualblock = controller.datablocks[blockpos].backblock;
    blockpos = getBlockPosByBlockId(controller.actualblock);
    controller.writepos = controller.datablocks[blockpos].size;
}
    if (controller.writepos>0)
        controller.writepos--;
renderFile();
}

function moveRight()
{
let blockpos = getBlockPosByBlockId(controller.actualblock);
if (controller.writepos > controller.datablocks[blockpos].size)
    controller.writepos = controller.datablocks[blockpos].size;
if (controller.writepos == controller.datablocks[blockpos].size)
{
    if (controller.datablocks[blockpos].nextblock==-1)
        return;
    console.log('Going to next block');
    controller.actualblock = controller.datablocks[blockpos].nextblock;
    blockpos = getBlockPosByBlockId(controller.actualblock);
    controller.writepos = 0;
}
if (controller.writepos < controller.datablocks[blockpos].size)
    controller.writepos++;
renderFile();
}

function treatControlChars(e)
{
    if (controller.currfile.type==0 || controller.currfile.type==undefined)
        return;

if (e.keyCode == 8) 
    {
        console.log('backspace');
        blockDeleteCharBack();
        e.preventDefault(); 
    }
    if (e.keyCode == 46) 
    {
        console.log('delete');
        e.preventDefault(); 
    }

    if (e.keyCode == 37) 
    {
        console.log('left');
        moveLeft();
        e.preventDefault(); 
    }

    if (e.keyCode == 39)
    {
        console.log('right');
        moveRight();
        e.preventDefault(); 
    }
}


$(document).keydown(treatControlChars);
$(document).keypress(treatChars);