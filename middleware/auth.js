// const jwt=require('jsonwebtoken')
const jwt = require('jsonwebtoken');
const UserModel=require('../models/user')


const auth_user=async(req,res,next)=>{
    try {
        // console.log('hello admin')
        const{token}=req.cookies
        // // console.log(token)
        const verify_token=jwt.verify(token,'Amitchaudharyid')
        // console.log(verify_token)
        const user_data=await UserModel.findOne({_id:verify_token.user_id})
        // console.log(user_data)
        req.user=user_data
        next()
    } catch (error) {
        res.redirect('/login')
    }
}
module.exports=auth_user