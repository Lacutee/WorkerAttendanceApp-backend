

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    latitude:{
        type: Number,
        required: false,
        default: 0,
    },
    longtitude:{
        type:Number,
        required:false,
        default:0,
    },
    attendance:{
        type: Boolean,
        required:false,
        default:false,
    },
    distance:{
        type:Number,
        required:false,
        default: 0,
    },
    userId:{
        type: String,
        required:true,
    }

},{
    timestamps:true
});

const Attendence = mongoose.model('Attendence', userSchema);

module.exports = Attendence;