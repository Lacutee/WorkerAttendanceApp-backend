//module yang digunakan
const expres = require('express');
const cors = require('cors');

//connect to mongodb database
const mongoose = require('mongoose');



//konfigure env variebel di .ENV file 
require('dotenv').config();

//mebuat express server di 5000
const app = expres();
const port = process.env.PORT || 5000;

app.use(cors());//cors middleware//parse json 
app.use(expres.json());

const uri = process.env.ATLAS_URI;//database uri
mongoose.connect(uri, {
    useNewUrlParser: true, //new connection behind the flag
    useCreateIndex: true //deprecating the ensure index
});//connect to database

const connection = mongoose.connection; 
console.log(connection)
connection.once('open', () =>{
    console.log("Mongodb database terkoneksi ");
});

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`)
})//memulai server di port 5000