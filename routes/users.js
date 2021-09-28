const router = require('express').Router();
var crypto = require('crypto');
let User = require('../models/users.model');
const config = require('../config.json');
const jwt = require('jsonwebtoken');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
   
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


router.route('/register').post((req, res) => {
    
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const tmp = encrypt(req.body.password);
    const password = tmp.encryptedData;
    const iv = tmp.iv;
    const role = req.body.role;

    const newUser = new User({
        username,
        name,
        email,
        password,
        role,
        iv
    });

    newUser.save()
    .then(() => res.json(password))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const username = req.body.username;
    var password = req.body.password;
    
    User.find({'username' : username}).
    then(user => {
        var iv = user[0].iv;
        var encryptedData = user[0].password;
        var decryptedPass = {iv, encryptedData}
        var test = decrypt(decryptedPass)
        // if(password == decrypt(decryptedPass)) {
        //     const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        //     const { password, ...userWithoutPassword } = user;
            
        // } else {
        //     // const token = jwt.sign({ sub: user[0].id, role: user[0].role }, config.secret);
        //     // const { password, ...userWithoutPassword } = user;
        //     // res.send(token);
        //     res.status(400).json('Error : wrong password');
        // }
        res.send(test);
    })
    .catch(err => res.status(400).json('Error: username not found '));;
});

module.exports = router;