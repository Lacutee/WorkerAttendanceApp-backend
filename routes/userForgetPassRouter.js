const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const { AutoEncryptionLoggerLevel } = require('mongodb');
const crypto = require('crypto');

module.exports = router;


router.get('/forget/', question)

function question(req, res, next){
    User.find()
        .then(user => res.json({question: user.question, answer: user.answer, email: user.email, userId: user._id}))
        .catch(err => err.status(400).json('question not found'))
}

