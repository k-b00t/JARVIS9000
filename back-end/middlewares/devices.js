'use strict';

const devicesModel = require('../databases/mongodb').devicesModel;
const groupDevicesModel = require('../databases/mongodb').groupDevicesModel;


const newDevice = (req, res)=>{
    if(req.body['name'] && req.body['ip'] && req.body['icon'] && req.body['command']) {
        new devicesModel({
            name: req.body['name'],
            icon: req.body['icon'],
            ip: req.body['ip'],
            command: req.body['command'],
            selector: req.body['selector']
        }).save((err, dataDevice)=>{
            if(err) {
                res.send({
                    newDevice: false,
                    message: 'Error to access database'
                })
            } else {
                groupDevicesModel.findOne({name: req.body.groupname}, (err, dataGroup)=>{
                    if(err) {
                        res.send({
                            newDevice: false,
                            message: 'Error to access database'
                        })
                    } else {
                        dataGroup.devices.push(dataDevice._id);
                        groupDevicesModel.findOneAndUpdate({name: req.body.groupname}, {
                            devices: dataGroup.devices
                        }, {new: true}, (err, data)=>{
                            res.send({
                                newDevice: true,
                                data: dataDevice
                            })
                        })
                    }
                })
            }
        })
    }

}

const modifyDevice = (req, res)=>{
    console.log(req.body)
    devicesModel.findByIdAndUpdate(req.body.id, {
        name: req.body['name'],
        icon: req.body['icon'],
        ip: req.body['ip'],
        command: req.body['command'],
        selector: req.body['selector']
    }, {new: true}, (err, data)=>{
        res.send({
            modifyDevice: true,
            data: data
        })
    })
}

const deleteDevice = (req, res)=>{
    devicesModel.findByIdAndDelete(req.params.device, (err, data)=>{
        groupDevicesModel.findOne({name: req.params.group}, (err, data)=>{
            data.devices = data.devices.filter((d)=>{
                return d._id != req.params.device;
            })
            groupDevicesModel.findOneAndUpdate({name: req.params.group}, {
                devices: data.devices
            }, (err, data)=>{
                res.send({ deleteDevice: true })
            })
        })
    })
}


module.exports = {
    newDevice: newDevice,
    modifyDevice: modifyDevice,
    deleteDevice: deleteDevice
}