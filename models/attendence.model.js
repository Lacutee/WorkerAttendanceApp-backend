const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendenceScheme = new Schema({
    location:{
        type: Array,
        required: false,
        default: [0,0]
    },
    attendance:{
        type: Boolean,
        required: false,
    },
    distance:{
        type:Number,
        required: false,
        default: 0,
    },
    userId:{
        type: String,
        required: true,
    }

},{
    timestamps: true
});

const Attendence = mongoose.model('Attendence', attendenceScheme);

module.exports = Attendence;