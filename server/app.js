'use strict';

const cors = require('cors');
const helmet = require('helmet');
const jwt = require('./middlewares/jwt');
const router = require('./routing/router');
const socket = require('./routing/socket');
const tcpServer = require('./routing/tcpServer');
const middlewareRedirect = require('./middlewares/redirect');

const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongodb = require('./databases/mongodb');
const socketIo = require('socket.io');
const express = require('express');
const https = require('https');
const http = require('http');

const stats = require('./functions/stats');


const cert = {
    key: fs.readFileSync('./certificate/key'),
    cert: fs.readFileSync('./certificate/crt')
}
const corsOpt = {
    credentials: true,
    origin: JSON.parse( fs.readFileSync('./config.json') ).corsOrigin
}

const expressApi = express();
const expressStatic = express();

const serverRedirect = http.createServer(middlewareRedirect);
const serverStatic   = https.createServer(cert, expressStatic);
const serverApi      = https.createServer(cert, expressApi);

const io  = socketIo(serverApi);
global.io = io.on('connection', socket);

setInterval(()=>{ stats(); }, 1000)


mongodb.connect();
mongodb.testAdminUser();

expressStatic.use(express.static('views'));

expressApi.use(cors(corsOpt));
expressApi.use(helmet());
expressApi.use(cookieParser());
expressApi.use(bodyParser.json());
expressApi.use(jwt.checkerJwt);
expressApi.use(jwt.controlError);
expressApi.use(router);

serverApi.listen(3000, ()=>{
    console.log('Node2:3000   status: connected');
})

serverStatic.listen(443, ()=>{
    console.log('Node3:443    status: connected');
})

serverRedirect.listen(80, ()=>{
    console.log('Node4:80     status: connected\n');
})