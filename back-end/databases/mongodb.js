'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const secret = JSON.parse( fs.readFileSync('./secrets.json') ).mongodb;
const endpoint = JSON.parse( fs.readFileSync('./config.json') ).mongodb;

const url = endpoint.replace('<password>', secret);


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
})

const userModel = mongoose.model('userModel', userSchema);



const devicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: String,
    ip: {
        type: String,
        required: true
    },
    command: {
        type: String,
        required: true
    },
    selector: {
        type: String,
        required: true
    }
})

const devicesModel = mongoose.model('devicesModel', devicesSchema);



const groupDevicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'devicesModel',
        autopopulate: true
    }]
}).plugin(require('mongoose-autopopulate'));

const groupDevicesModel = mongoose.model('groupDevicesModel', groupDevicesSchema);




module.exports = {
    connect: ()=>{
        mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        console.log('Node2:27017  status: connected');
    },
    testAdminUser: ()=>{
        userModel.findOne({username: 'admin'}, (err, data)=> {
            if(err) throw err;
            if(!data) {
                bcrypt.hash('hal9000', 11, (err, hash)=>{
                    if(err) throw err;
                    new userModel({
                        username: 'admin',
                        password: hash,
                        role: 'admin',
                        timestamp: Date.now()
                    }).save((err)=>{
                        if(err) throw err;
                        console.log('Created new Admin user');
                    })
                })
            }
        })
    },
    userModel: userModel,
    devicesModel: devicesModel,
    groupDevicesModel: groupDevicesModel
}