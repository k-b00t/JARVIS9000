'use strict';

const devicesModel = require('../databases/mongodb').devicesModel;
const groupDevicesModel = require('../databases/mongodb').groupDevicesModel;


const listAllGroups = (req, res)=>{
    groupDevicesModel.find()
      .select('-_id')
      .exec((err, data)=>{
        if(err) {
            res.send({
                listGroup: false,
                message: 'Error to access database'
            })
        } else if(!data) {
            res.send({
                listGroup: false,
                message: 'Not groups found'
            })
        } else {
            res.send({
                listGroup: true,
                data: data
            })
        }
    })
}

const newGroup = (req, res)=>{
    groupDevicesModel.findOne({name: req.body.groupname}, (err, data)=>{
        if(err) {
            res.send({
                newGroup: false,
                message: 'Error to access database'
            })
        } else if(data) {
            res.send({
                newGroup: false,
                message: 'The group already exists'
            })
        } else {
            new groupDevicesModel({
                name: req.body.groupname,
                icon: req.body.icon,
                devices: [],
            }).save((err, data)=>{
                if(err) {
                    res.send({
                        newGroup: false,
                        message: `An error occurred while adding the ${req.body.groupname}`
                    })
                } else {
                    res.send({newGroup: true})
                }
            })
        }
    })
}

const modifyGroup = (req, res)=>{
    groupDevicesModel.findOneAndUpdate({ name: req.body.groupname }, {
        icon: req.body.icon
    }, (err, data)=>{
        if(err) {
            res.send({
                modifyGroup: false,
                message: `An error occurred while modify the ${req.body.username}`
            })
        } else {
            res.send({modifyGroup: true})
        }
    })
}

const deleteGroup = (req, res)=> {
    if(req.params.username !== 'admin') {
        groupDevicesModel.findOneAndDelete({name:req.params.groupname}, (err, data)=>{
            if(err) {
                res.send({
                    deleteGroup: false,
                    message: `An error occurred while delete the ${req.params.groupname}`
                })
            } else if(!data) {
                res.send({
                    deleteGroup: false,
                    message: `User: ${req.params.groupname} not exist in database`
                })
            } else {
                data.devices.forEach(id=>{
                    devicesModel.findByIdAndDelete(id, (err, data)=>{
                        if(!err) res.send({deleteGroup: true});
                    })
                })
            }
        })
    } else {
        res.send({
            deleteGroup: false,
            message: `This user cannot be deleted`
        })
    }
}



module.exports = {
    listAllGroups: listAllGroups,
    newGroup: newGroup,
    modifyGroup: modifyGroup,
    deleteGroup: deleteGroup
}