'use strict';

const fs = require('fs');
const mysql = require('mysql');

const config = JSON.parse( fs.readFileSync('./config.json') ).mysql;
const secret = JSON.parse( fs.readFileSync('./secret.json') ).mysql;

module.exports = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: secret
})