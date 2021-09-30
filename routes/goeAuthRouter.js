const express = require('express');
const router = express.Router();
const AttendenceService = require('../role/geo.permision');
const authorize = require('../role/AuthGateway')
const Role = require('../role/role');
const Attendence = require('../models/attendence.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');

router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/userId/:id', authorize(), getById);
router.get('/:id', authorize(), getByUserId);
router.delete('/delete/:id', authorize(Role.User), dellById);
router.post('/add', authorize(Role.User), createNew)       // all authenticated users
module.exports = router;


function getAll(req, res, next) {
    AttendenceService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);


    AttendenceService.getById(id)
        .then(user => {if(user.userId !== currentUser.sub && currentUser.role !== Role.Admin){return res.status(401).json({ message: 'Unauthorized' });}})
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function dellById(req, res, next){
    const currentUser = req.user;


    Attendence.findByIdAndDelete(req.params.id)
        .then(user => {if(user.userId !== currentUser.sub){return res.status(401).json({ message: 'Unauthorized' });}})
        .then(()=>{res ? res.json(`User ${req.params.id} has been deleted`) : res.status(400)})
        .catch(err=>{next(err)})
}

function createNew(req, res, next){
    const latitude = Number(req.body.latitude);
    const longtitude = Number(req.body.longtitude);
    const distance = Number(req.body.distance);
    const attendence = req.body.attendence;
    const userId = req.user.sub;

    const NewUser = new Attendence({
        latitude,
        longtitude,
        distance,
        attendence,
        userId
    });
    NewUser.save().
            then(()=>{res.json('attendence has been added')}).
            catch(err =>{next(err)})
}
