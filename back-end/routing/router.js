'use strict';

const user = require('../middlewares/user');
const groups = require('../middlewares/groups');
const devices = require('../middlewares/devices');

const router = require('express').Router();


router.get('/user', user.listAllUsers);
router.get('/groups', groups.listAllGroups);

router.post('/login', user.loginUser);
router.post('/user', user.newUser);
router.post('/group', groups.newGroup);
router.post('/devices', devices.newDevice);

router.put('/user', user.modifyUser);
router.put('/group', groups.modifyGroup);
router.put('/devices', devices.modifyDevice);

router.delete('/user/:username', user.deleteUser);
router.delete('/group/:groupname', groups.deleteGroup);
router.delete('/devices/:group/:device', devices.deleteDevice);



module.exports = router;