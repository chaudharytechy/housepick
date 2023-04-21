const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema({

    status:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        code:{
            type:String,
            required:true
        },
        expireIn:{
            type:String,
            required:true
        }
    }


},{timestamps:true})

const UserModel = mongoose.model('user',UserSchema)

module.exports = UserModel