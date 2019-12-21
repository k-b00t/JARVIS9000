'use strict';

const cors = require('cors');
const helmet = require('helmet');
const jwt = require('./middlewares/jwt');
const router = require('./routing/router');
const socket = require('./routing/socket');
const tcpServer = require('./routing/tcpServer');

const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongodb = require('./databases/mongodb');
const socketIo = require('socket.io');
const express = require('express');
const https = require('https');

const cert = {
    key: fs.readFileSync('../certs/privkey.pem'),
    cert: fs.readFileSync('../certs/fullchain.pem')
}
const corsOpt = {
    credentials: true,
    origin: 'https://192.168.43.10'
}

const app = express();
const api = https.createServer(cert, app)
const io  = socketIo(api);
global.io = io.on('connection', socket);

mongodb.connect();
mongodb.testAdminUser();

app.use(cors(corsOpt));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(jwt.checkerJwt);
app.use(jwt.controlError);
app.use(router);


api.listen(3000, ()=>{
    console.log('Node4:3000   status: connected');
})