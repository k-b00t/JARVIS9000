'use strict';

const os = require('os');
const cpuStat = require('cpu-stat');

module.exports = (callback)=>{
    cpuStat.usagePercent((err, perc, sec)=>{
        const mem = ((os.totalmem() / 1000000) - (os.freemem() / 1000000)) / 1000;
        global.io.emit('getStats', {
            cpu: perc.toFixed(2),
            ram: mem.toFixed(2)
        })
    })
}