const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    name: {
        type : String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    role:{
        type: String,
        required: true,
        trim: true
    },
    location:{
        type: Array,
        require: false,
        default: [0,0]
    },
    attendance:{
        type: Boolean,
        require:false,
        default:false,
    }

},{
    timestamps:true
});

const User = mongoose.model('User', userSchema);

module.exports = User;