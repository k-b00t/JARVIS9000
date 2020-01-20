'use strict';

const net = require('net');


const server = net.createServer((socket)=>{
    socket.on('data', (data)=>{
        data = data.toString();

        const ip = socket.remoteAddress.replace('::ffff:', '');

        const buffer = {
            ip: ip,
            command: {
                value: data[0],
                state: data[1]
            },
            selector: `ip${ip.replace(/\./g, '')}com${data[0]}`
        }
        global.io.emit('changeState', buffer);
    })      
})

server.listen(4444, ()=>{
    console.log('Node1:4444   status: connected');
})