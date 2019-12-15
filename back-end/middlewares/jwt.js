'use strict';

const fs = require('fs');
const checkerJwt = require('express-jwt');

const secret = JSON.parse( fs.readFileSync('./secrets.json') ).jwt


module.exports = {
    checkerJwt: checkerJwt({
        secret: secret,
        getToken: (req)=>{
            return req.cookies['auth'];
        }
    }).unless({path: ['/login']})
    ,
    controlError: (err, req, res, next)=> {
        if (err.name === 'UnauthorizedError') {
            console.log({err: 'invalid token...'})
            res.send({err: 'Invalid token'});
        }
    }
}