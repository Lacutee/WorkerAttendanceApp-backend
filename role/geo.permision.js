const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('./role');
const Attendence = require('../models/attendence.model')


module.exports = {
    getAll,
    getById
};


async function getAll() {
    return Attendence.find()
              .then(attendence =>{
                  return attendence
              })
    
}

async function getById(id) {
      return Attendence.findById(id)
            .then(attendence =>{
                return attendence
            })
}