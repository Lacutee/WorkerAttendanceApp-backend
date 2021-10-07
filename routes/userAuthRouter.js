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
router.put('/forget/:id', authorize(), forgetPass);
router.get('/question/:id', authorize(), question);       
// all authenticated users
module.exports = router;


function getAll(req, res, next) {
    
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
    
}

function question(req, res, next){
    const currentUser = req.user;
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findById(req.params.id)
        .then(user => res.json({question: user.question, answer: user.answer}))
        .catch(err => err.status(400).json('question not found'))

}

function forgetPass(req, res, next){
    const id = req.params.id;
    var password1 = req.body.password1;
    var passowrd2 = req.body.password2;
    const currentUser = req.user;

    console.log('id forget = '+id)
    if (req.params.id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if(password1 === passowrd2){
        password1 = crypto.createHash('sha256').update(password1).digest('base64');


        User.findByIdAndUpdate(
            {_id: id},
            { $set: 
                {
                password: password1
                }
            },
            {new: true},
            (err, newPass) =>{
                if(err){
                    res.json({
                        newPass,
                        success: false,
                        msg: 'Failed to update Password'
                    })
                }else{
                    res.json({newPass, success: true, msg: 'Password has been updated'})
                }
            }

        )
    }else{
        res.status(400).json('Password does not match')
    }
    
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
