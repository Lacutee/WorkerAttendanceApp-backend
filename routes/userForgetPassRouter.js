const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');
const crypto = require('crypto');

module.exports = router;


router.get('/forget/', question)
router.put('/update/:id', forgetPass)

function question(req, res, next){
    User.find()
        .then(user => res.json(user))
        .catch(err => err.status(400).json('question not found'))
}

function forgetPass(req, res, next){
    const id = req.params.id;
    var password = req.body.password;

        password = crypto.createHash('sha256').update(password).digest('base64');


        User.findByIdAndUpdate(
            {_id: id},
            { $set: 
                {
                password: password
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

    
}

