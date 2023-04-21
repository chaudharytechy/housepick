const mongoose = require('mongoose')


const BlogSchema = new mongoose.Schema({
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
    title:{
        type:String,
            required:true
    },
    description:{
        type:String,
            required:true
    }
},{timestamps:true})

const BlogModel = mongoose.model('blog',BlogSchema)
module.exports = BlogModel