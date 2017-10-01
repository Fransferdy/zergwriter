CREATE TABLE file
(
    fileid INT PRIMARY KEY NOT NULL,
    filename VARCHAR (150) NOT NULL,
    type INT NOT NULL,
    stamp INT NOT NULL,
    father INT NOT NULL
);
INSERT INTO file (fileid,filename,type,stamp,father) VALUES (1,'/',0,0,-1);


CREATE TABLE filedata
(
    internalid INT PRIMARY KEY,
    fileblockid INT NOT NULL,
    ownerfile INT NOT NULL,
    data VARCHAR (32) NOT NULL,
    stamp INT NOT NULL,
    nextblock INT,
    backblock INT,
    size INT,
    CONSTRAINT blockunique UNIQUE (fileblockid)
);

/*
INSERT INTO filedata (ownerfile,fileblockid,data,stamp,nextblock,backblock) VALUES (1,1,'root',1199,-1,-1);

*/