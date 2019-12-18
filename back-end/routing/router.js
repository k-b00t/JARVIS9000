'use strict';

const user = require('../middlewares/user');
const groups = require('../middlewares/groups');
const devices = require('../middlewares/devices');
const testRole = require('../middlewares/jwt').testRole;

const { check, validationResult } = require('express-validator');

const router = require('express').Router();


router.get('/user', user.listAllUsers);
router.get('/groups', groups.listAllGroups);



router.post('/login', [
    check('username').trim().escape(),
    check('password').trim().escape()
],user.loginUser);

router.post('/user',[
    check('username').trim().escape(),
    check('password').trim().escape(),
    check('role').trim().escape(),
], testRole, user.newUser);

router.post('/group', [
    check('groupname').trim().escape(),
    check('icon').trim().escape()
], testRole, groups.newGroup);

router.post('/devices', [
    check('name').trim().escape(),
    check('icon').trim().escape(),
    check('ip').trim().escape(),
    check('command').trim().escape(),
    check('selector').trim().escape()
], testRole, devices.newDevice);



router.put('/user', [
    check('username').trim().escape(),
    check('password').trim().escape(),
    check('role').trim().escape(),
], testRole, user.modifyUser);

router.put('/group', [
    check('groupname').trim().escape(),
    check('icon').trim().escape()
], testRole, groups.modifyGroup);

router.put('/devices', [
    check('name').trim().escape(),
    check('icon').trim().escape(),
    check('ip').trim().escape(),
    check('command').trim().escape(),
    check('selector').trim().escape()
], testRole, devices.modifyDevice);


router.delete('/user/:username', testRole, user.deleteUser);
router.delete('/group/:groupname', testRole, groups.deleteGroup);
router.delete('/devices/:group/:device', testRole, devices.deleteDevice);



module.exports = router;