const express = require('express');
const router = express.Router();
const AttendenceService = require('../role/geo.permision');
const authorize = require('../role/AuthGateway')
const Role = require('../role/role');
const Attendence = require('../models/attendence.model');
const Users = require('../models/users.model')
const { AutoEncryptionLoggerLevel } = require('mongodb');
const formatDateTime = require('../helper-func/date-converter');
const { User } = require('../role/role');


router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);
router.get('/userId/:id', authorize(), getByUserId);
router.delete('/delete/:id', authorize(Role.User), dellById);
router.post('/add', authorize(Role.User), createNew)       // all authenticated users



module.exports = router;


function getAll(req, res, next) {
    Attendence.find().then(data=>{
        var empty = []
        data.map(datas=>{
            Users.findById(datas.userId).then(user=>{
                empty.push(user)
            })
            // empty.push(users)
        })
        res.send(empty)
        
    })
         .catch(err => next(err));        
}

function getByUserId(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    if (id !== currentUser.sub && currentUser.role !== Role.User) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    Attendence.find({'userId': req.params.id})
              .then(users => {
                var tmp = []
                users.map(
                    user =>{
                        tmp.push({attendance: user.attendance,
                                  location: user.location,
                                  distance: user.distance,
                                  userId: user.userId,
                                  Date: formatDateTime(user.createdAt, true)})
                    }
                )
                res.send(
                    tmp
                )
              })
              .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);


    AttendenceService.getById(id)
        .then(user => {if(user.userId !== currentUser.sub && currentUser.role !== Role.Admin){return res.status(401).json({user: user.userId});}})
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function dellById(req, res, next){
    const currentUser = req.user;

    Attendence.findByIdAndDelete(req.params.id)
        .then(user => {if(user.userId !== currentUser.sub){return res.status(401).json({ message: 'Unauthorized' });}})
        .then(()=>{res.json(`User ${req.params.id} has been deleted`)}) 
        .catch(err=>{next(err)})
}

function createNew(req, res, next){
    const location = req.body.location;
    const attendance_req = req.body.attendance;
    const distance = req.body.distance;
    const userId = req.user.sub;

    const convert_val = (attendance_req) =>{
        if(attendance_req === 1){
            return true;
        }else if(attendance_req === 0){
            return false;
        }else{
            return undefined;
        }
    }
    console.log(convert_val);
    const attendance = convert_val(attendance_req)

    const NewUser = new Attendence({
            location,
            attendance,
            distance,
            userId
    });
    NewUser.save().
            then(()=>{res.json('attendence has been added')}).
            catch(err =>{next(err)})
}