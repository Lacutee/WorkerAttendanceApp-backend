const express = require('express');
const router = express.Router();
const userService = require('../role/user.permision');
const authorize = require('../role/AuthGateway')
const Role = require('../role/role');
const User = require('../models/users.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');


// routes
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);
router.delete('/delete/:id', authorize, dellById);
router.post('/add', authorize(Role.Admin), createNew);
router.put('/update/:id', authorize(), updateId);       
// all authenticated users
module.exports = router;


function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function updateId(req, res, next){
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;

    const newData = {
        username,
        name,
        email,
        password,
        role
    }
    User.findByIdAndUpdate(
            req.params.id, 
            newData,
            {new: true},
            (err, datas) =>{
                if(err) return res.status(500).send(err);
                return res.send(datas)
            }

        )
};

function getById(req, res, next) {  
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function dellById(req, res, next){

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findByIdAndDelete(req.params.id).
        then(()=>{res.json(`User ${req.params.id} has been deleted`)}).
        catch(err=>{next(err)})

    }

function createNew(res, req, next){
    const username = res.body.username;
    const password = res.body.password;
    const name = res.body.name;
    const role = res.body.role;
    const email = res.body.email;

    const NewUser = new User({
        username,
        name,
        email,
        password,
        role
    })

    NewUser.save().
            then(()=>{res.json('User has been added')}).
            catch(err =>{next(err)})
}
