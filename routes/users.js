const router = require('express').Router();
var crypto = require('crypto');
let User = require('../models/users.model');
const config = require('../config.json');
const jwt = require('jsonwebtoken');



router.route('/register').post((req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    var password = req.body.password;
    const role = req.body.role;
    password = crypto.createHash('sha256').update(password).digest('base64');

    const newUser = new User({
        username,
        name,
        email,
        password,
        role
    });

    newUser.save()
    .then(() => res.json('Success register!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const username = req.body.username;
    var password = req.body.password;
    password = crypto.createHash('sha256').update(password).digest('base64');

    User.find({'username' : username}).
    then(user => {
        if(password == user.password) {
            const token = jwt.sign({ sub: user.username, role: user.role }, config.secret);
            const { password, ...userWithoutPassword } = user;
            res.send(token);
        } else{
            const token = jwt.sign({ sub: user.username, role: user.role }, config.secret);
            const { password, ...userWithoutPassword } = user;
            res.send(token);
            // res.status(400).json('Error : wrong password');
        }
    })
    .catch(err => res.status(400).json('Error: username not found '));;
});

module.exports = router;