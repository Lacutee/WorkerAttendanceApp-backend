

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    location:{
        type: Array,
        required: false,
        default: [0,0]
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