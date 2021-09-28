const express = require('express');
const router = express.Router();
const AttendenceService = require('../role/geo.permision');
const authorize = require('../role/AuthGateway')
const Role = require('../role/role');
const Attendence = require('../models/attendence.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');

router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);
router.delete('/delete/:id', authorize, dellById);
//router.post('/add', authorize(Role.Admin), createNew)       // all authenticated users
module.exports = router;


function getAll(req, res, next) {
    AttendenceService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    AttendenceService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function dellById(req, res, next){

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    Attendence.findByIdAndDelete(req.params.id).
        then(()=>{res ? res.json(`User ${req.params.id} has been deleted`) : res.status(400)}).
        catch(err=>{next(err)})
}

function createNew(res, req, next){
    const username = res.body.username;
    const password = res.body.password;
    const name = res.body.name;
    const role = res.body.role;
    const email = res.body.email;

    const NewUser = new Attendence({
        username,
        name,
        email,
        password,
        role
    })

    NewUser.save().
            then(()=>{res ? res.json('User has been added') : res.status(400)}).
            catch(err =>{next(err)})
}
