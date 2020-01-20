'use strict'

const fs = require('fs');


const redirectUrl = JSON.parse(fs.readFileSync('./config.json')).redirectUrl

module.exports = (req, res)=>{
    res.writeHead(301, {Location: redirectUrl});
    res.end();
}