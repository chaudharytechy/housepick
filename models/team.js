const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    image:{
        public_id:{
            type:String,
        required:true
        },
        url:{
            type:String,
        required:true
        }
    },
    name:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true})

const TeamModel = mongoose.model('team',TeamSchema)
module.exports = TeamModel