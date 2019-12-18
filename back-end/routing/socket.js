'use strict';

const net = require('net');
const stats = require('../functions/stats');

module.exports = (socket)=>{
    let buffer = new Object;

    socket.on('getData', (dataClnt)=>{
        Object.keys(dataClnt).forEach(ip=>{
            const tcp = new net.Socket();

            tcp.connect(4445, ip);
            tcp.write('i');
            tcp.on('data', (dataESP)=>{
                buffer = {
                    ip: ip,
                    command: []
                }
                dataClnt[ip].forEach(d=>{
                    buffer['command'].push({
                        value: d,
                        state: dataESP.toString()[d]
                    })
                })
                tcp.destroy();
                socket.emit('getData', buffer);
            })
            tcp.on('error', (err)=>{ })
        })
    })

    socket.on('changeState', (dataClnt)=>{
        const tcp = new net.Socket();

        tcp.connect(4445, dataClnt.ip);
        tcp.write(dataClnt.command);
        tcp.on('data', (dataESP)=>{
            buffer = {
                ip: dataClnt.ip,
                command: {
                    value: dataClnt.command,
                    state: dataESP.toString()
                },
                selector: dataClnt.selector
            }
            global.io.emit('changeState', buffer);
            tcp.destroy();
        })
        tcp.on('error', (err)=>{ })
    })
    setInterval(()=>{
        stats();
    }, 1000)

    socket.on('disconnect', ()=> {})
}
