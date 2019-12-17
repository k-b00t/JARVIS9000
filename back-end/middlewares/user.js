'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../databases/mongodb').userModel;

const secret = JSON.parse( fs.readFileSync('./secrets.json') ).jwt

let attempts = {};

const loginUser = (req, res)=> {
    if(!req.body['username'] && !req.body['username']) {
        res.send({
            login: 'both',
            message: {
                user: 'Field required',
                password: 'Field required'
            }
        })
    } else {
        if(req.body['username']) {
            if(req.body['password']) {
                userModel.findOne({username: req.body.username}, (err, data)=>{
                    if(err) {
                        throw err;
                    } else if(!data) {
                        res.send({
                            login: 'username',
                            message: 'Bad username'
                        })
                    } else {
                        if(!attempts['req.user.username']) {
                            attempts['req.user.username'] = {
                                count: 0
                            }
                        }
                        if(attempts['req.user.username'].count === 3 && attempts['req.user.username'].timestamp > Date.now() ){
                            res.send({
                                login: 'maxTry',
                                message: attempts['req.user.username'].timestamp
                            })
                        } else {
                            if(attempts['req.user.username'].count === 3) {
                                attempts['req.user.username'] = {
                                    count: attempts['req.user.username'].count -1
                                } 
                            }
                            bcrypt.compare(req.body.password, data.password, (err, data)=>{
                                if(err) throw err;
                                if(data){
                                    attempts['req.user.username'] = {
                                        count: 0
                                    }
                                    const token = jwt.sign({username: req.body.username}, secret);
                                    res.cookie('auth', token, { expires: new Date(Date.now() + 1000 * 3600 * 24 * 365), sameSite:'strict' }).send({login: true});
                                } else {
                                    attempts['req.user.username'] = {
                                        count: attempts['req.user.username'].count +1,
                                    }
                                    
                                    if(attempts['req.user.username'].count === 3) {
                                        attempts['req.user.username'].timestamp = Date.now() + 1000 * 60;
                                        res.send({
                                            login: 'maxTry',
                                            message: attempts['req.user.username'].timestamp
                                        })
                                    } else {
                                        res.send({
                                            login: 'password',
                                            message: 'Bad Password'
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            } else {
                res.send({
                    login: 'password',
                    message: 'Field required'
                })
            }
        } else {
            res.send({
                login: 'username',
                message: 'Field required'
            })
        }
    }
}


const listAllUsers = (req, res)=> {
    userModel.find()
    .select(['-password', '-_id'])
    .exec((err, data)=>{
        if(err) {
            res.send({
                listUser: false,
                message: 'Error to access database'
            })
        } else if(!data) {
            res.send({
                listUser: false,
                message: 'Not users found'
            })
        } else {
            res.send({
                listUser: true,
                data: data
            })
        }
    })
}


const newUser = (req, res)=> {
    userModel.findOne({username: req.body.username}, (err, data)=>{
        if(err) {
            res.send({
                newUser: false,
                message: 'Error to access database'
            })
        } else if(data) {
            res.send({
                newUser: false,
                message: 'The user already exists'
            })
        } else {
            const hash = bcrypt.hashSync(req.body.password, 11);
            if(hash) {
                new userModel({
                    username: req.body.username,
                    password: hash,
                    role: req.body.role,
                    timestamp: Date.now()
                }).save((err, data)=>{
                    if(err) {
                        res.send({
                            newUser: false,
                            message: `An error occurred while adding the ${req.body.username}`
                        })
                    } else {
                        res.send({newUser: true})
                    }
                })
            }
        }
    })
}


const modifyUser = (req, res)=> {
    userModel.findOneAndUpdate({ username: req.body.username }, {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    }, (err, data)=>{
        if(err) {
            res.send({
                modifyUser: false,
                message: `An error occurred while modify the ${req.body.username}`
            })
        } else {
            res.send({modifyUser: true})
        }
    })
}

const deleteUser = (req, res)=> {
    if(req.params.username !== 'admin') {
        userModel.findOneAndDelete({username:req.params.username}, (err, data)=>{
            if(err) {
                res.send({
                    deleteUser: false,
                    message: `An error occurred while delete the ${req.params.username}`
                })
            } else if(!data) {
                res.send({
                    deleteUser: false,
                    message: `User: ${req.params.username} not exist in database`
                })
            } else {
                res.send({deleteUser: true});
            }
        })
    } else {
        res.send({
            deleteUser: false,
            message: `This user cannot be deleted`
        })
    }
}




module.exports = {
    listAllUsers: listAllUsers,
    newUser: newUser,
    loginUser: loginUser,
    modifyUser: modifyUser,
    deleteUser: deleteUser
}