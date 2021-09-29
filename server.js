require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./helper-func/error-handler');


const mongoose = require('mongoose');
const { User } = require('./models/users.model')

require('dotenv').config();

const uri = process.env.ADMIN_URI;//database uri

mongoose.connect(uri, {
  useNewUrlParser: true, //new connection behind the flag
  useCreateIndex: true //deprecating the ensure index
});//connect to database

const connection = mongoose.connection; 
console.log(connection)
connection.once('open', () =>{
  console.log("Mongodb database terkoneksi ");
});




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/users', require('./routes/userAuthRouter'));
app.user('/attandence', require('./routes/goeAuthRouter'))
app.use('/home', require('./routes/users'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});