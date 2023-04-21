const mongoose = require('mongoose')


const connect = () =>{
    return mongoose.connect(process.env.DB_URL)

    .then(()=>{
        console.log('database connected...')
    })
    .catch((error)=>{
        console.log(error)
    })
} 

module.exports = connect