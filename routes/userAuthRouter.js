const express = require('express');
const router = express.Router();
const userService = require('../role/user.permision');
const authorize = require('../role/AuthGateway')
const Role = require('../role/role');
const User = require('../models/users.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');
const crypto = require('crypto');


// routes
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);
router.delete('/delete/:id', authorize, dellById);
router.post('/add', authorize(Role.Admin), createNew);
router.put('/update/:id', authorize(), updateId);
router.put('/office/edit/:id', authorize(), officeEdit);
router.get('/office/:id', authorize(), officeGet)
// all authenticated users
module.exports = router;

function officeGet(req, res, next){
    const id = req.params.id;
    User.findById(id)
        .then(res =>{
            res.send({
                location: res.officeLoc
            })
        })
}

function officeEdit(req, res, next){
    const id = req.params.id;
    const location = req.body.officeLoc;

    User.findByIdAndUpdate(
        {_id: id},
        { $set: 
            {
            officeLoc: location
            }
        },
        {new: true},
        (err, newLoc)=>{
            if(err){
                res.json({
                    newLoc,
                    success: false,
                    msg: 'Failed to update Location'
                })
        }else{
            res.json({newLoc, success: true, msg: 'Location has been updated'})
        }
    }
    
    )
}
        

function getAll(req, res, next) {
    
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
    
}


function updateId(req, res, next){
    const {id: _id} = req.params;
    const username = req.body.username;
    const name = req.body.name;
    var password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    const question = req.body.question;
    const answer = req.body.answer;

    password = crypto.createHash('sha256').update(password).digest('base64');

    const newData = {
        username,
        name,
        email,
        password,
        role,
        question,
        answer
    }
    User.findByIdAndUpdate(
            _id, 
            newData,
            {new: true},
            (err, newData) => {
                if (err) {
                  res.json({
                    newData,
                    success: false,
                    msg: 'Failed to update User'
                  })
                } else {
                  res.json({newData, success: true, msg: 'User hase been updated'})
                }
              }

        )
};

function getById(req, res, next) {  
    const currentUser = req.user;
    const id = req.params.id;

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function dellById(req, res, next){
    const currentUser = req.user;
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
