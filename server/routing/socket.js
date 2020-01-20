'use strict';

const net = require('net');
const dgram = require('dgram');


module.exports = (socket)=>{
    socket.on('getData', (dataClnt)=>{
        Object.keys(dataClnt).forEach(ip=>{
            if(dataClnt[ip].protocol === 'tcp') {
                getStateTcp(socket, dataClnt[ip], ip);
            } else if (dataClnt[ip].protocol === 'udp') {
                getStateUdp(socket, dataClnt[ip], ip);
            }
        })
    })

    socket.on('changeState', (dataClnt)=>{
        if(dataClnt.protocol === 'tcp') {
            changeStateTcp(dataClnt);
        } else if(dataClnt.protocol === 'udp') {
            changeStateUdp(dataClnt);
        }
    })

    socket.on('disconnect', (dataClnt)=> {})
}




function getStateTcp(socket, dataClnt, ip) {
    const tcp = new net.Socket();

    tcp.connect(4445, ip);
    tcp.write('i');
    tcp.on('data', (dataESP)=>{
        let buffer = {
            ip: ip,
            command: []
        }
        dataClnt.command.forEach(d=>{
            buffer['command'].push({
                value: d,
                state: dataESP.toString()[d]
            })
        })
        tcp.destroy();
        socket.emit('getData', buffer);
    })
    tcp.on('error', (err)=>{ })
}


function getStateUdp(socket, dataClnt, ip) {
    let status = {
        L: '',
        E: ''
    }

    packetSenderPromise('ACTLU1', 7, ip)
        .then(data=>{
            status.L = [...data];
        })
        .then(()=>{
            return packetSenderPromise('ACTENC', 4, ip)
                .then(data=>{
                    status.E = [...data];
                })
        })
        .then(()=>{
            let buffer = {
                ip: ip,
                command: []
            }
            dataClnt.command.forEach(d=>{
                const result = (d[0] === 'L')
                    ? status.L.filter(f=>{ return d.slice(3,) === f.slice(2,)  })
                    : status.E.filter(f=>{ return d.slice(3,) == f.slice(2,) });

                buffer.command.push({
                    value: d,
                    state: (result[0][1] === 'S') ? '1' : '0'
                })
            })
            socket.emit('getData', buffer);
        })
        .catch(err=>{
            throw err;
        })
}


function packetSenderPromise(command, loop, ip) {
    let count = 0;
    let buffer = new Array

    return new Promise((resolve, reject)=> {
        const client = dgram.createSocket('udp4');

        client.send(Buffer.from(command), 5000, ip, (err) => {
            if(err) reject(err);
        })

        client.on('message', (data)=> {
            buffer.push(data.toString());
            count++;
            if(count === loop) client.close();
        })

        client.on('close', ()=>{
            resolve(buffer);
        })      
    })
}



function changeStateTcp(dataClnt) {
    const tcp = new net.Socket();

    tcp.connect(4445, dataClnt.ip);
    tcp.write(dataClnt.command);
    tcp.on('data', (getData)=>{
        const buffer = {
            ip: dataClnt.ip,
            command: {
                value: dataClnt.command,
                state: data.toString()
            },
            selector: dataClnt.selector
        }
        global.io.emit('changeState', buffer);
        tcp.destroy();
    })
    tcp.on('error', (err)=>{ })
}



function changeStateUdp(dataClnt) {
    const udp = dgram.createSocket('udp4');

    udp.send(Buffer.from(dataClnt.command), 5000, dataClnt.ip, (err) => {
        if(err) console.log(err);       
    })
    udp.on('message', (data)=> {
        const buffer = {
            ip: dataClnt.ip,
            command: {
                value: dataClnt.command,
                state: (data.toString()[1] === 'S') ? '1' : '0'
            },
            selector: dataClnt.selector
        }
        global.io.emit('changeState', buffer);
        udp.close();
    })
}