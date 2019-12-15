'use strict';

const fs      = require('fs');
const http    = require('http');
const https   = require('https');
const express = require('express');
const app = express();



http.createServer((req, res)=>{
    res.writeHead(301, {Location: 'https://hal9000.evils.in:443/'});
    res.end();
}).listen(80, ()=>{
    console.log('Node0:80     status: connected');
})

app.use(express.static('public'));

https.createServer({
    key: fs.readFileSync('../certs/privkey.pem'),
    cert: fs.readFileSync('../certs/fullchain.pem')
}, app).listen(443, ()=>{
    console.log('Node1:443    status: connected');
})