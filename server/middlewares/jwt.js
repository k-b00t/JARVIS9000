'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const checkerJwt = require('express-jwt');
const userModel = require('../databases/mongodb').userModel;

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
    ,
    testRole: (req, res, next)=> {
        const username = jwt.verify(req.cookies['auth'], secret).username;
        userModel.findOne({username: username}, (err, data)=>{
            if(data['role'] === 'admin'){
                next();
            } else {
                res.send({error: false});
            }
        })
    }
}