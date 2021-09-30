const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalSetting = new Schema({
    latitude:{
        type:Number,
    },
    longtitude:{
        type:Number,
    },
    jamMasuk:{
        type:TimeRanges,
    },
    jamPulang:{
        type:TimeRanges,
    },
    hariLibur:{
        type:Date,
    },
    hariMasuk:{
        type:Date,
    }
},{
    timestamps:true
});

const globalSetting = mongoose.model('golbalSetting', userSchema);

module.exports = globalSetting;    