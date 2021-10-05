const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('./role');
const Users = require('../models/users.model')


module.exports = {
    getAll,
    getById
};


async function getAll() {
    return Users.find()
              .then(users =>{
                const { password, ...userWithoutPassword } = users;
                return userWithoutPassword;
              })
    
}

async function getById(id) {
      return Users.findById(id).
                then(users =>{
                  const { password, ...userWithoutPassword } = users;
                  return userWithoutPassword;
                })
}

