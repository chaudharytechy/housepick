const mongoose = require('mongoose')



const PropertySchema = new mongoose.Schema({
    front_image:{

        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    all_image:[
        
    ],
    property_name:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
   
    type:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
   bedroom:{
        type:String,
        required:true
    },
    bathroom:{
        type:String,
        required:true
    },
    garage:{
        type:String,
        required:true
    },
    amenities:[{
        type:String,
        required:true
    }]
},{timestamps:true})


const PropertyModel = mongoose.model('property',PropertySchema)
module.exports = PropertyModel