const mongoose = require('mongoose')


const aboutSchema = new mongoose.Schema({
    main_heading:{
        type:String,
        required:true
    },
    description_heading:{
        type:String,
        required:true
    },
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
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

const AboutModel = mongoose.model('about', aboutSchema)
module.exports = AboutModel