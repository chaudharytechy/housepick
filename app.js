require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
var cors = require('cors')
const web = require('./routes/web')
const fileUpload = require('express-fileupload')
const connectDB = require('./db/connectdb')
const session = require('express-session')
const flash = require('connect-flash')
var cloudinary = require('cloudinary').v2;


app.use(cors());

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });


connectDB()

app.use(express.urlencoded({extended:false}));


app.use(fileUpload({useTempFiles : true}));


//for flash message
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
  
}));

app.use(flash());


app.use('/',web)


app.set('view engine','ejs')




//public folder setup
app.use(express.static('public'))


app.listen(port, ()=>{
    console.log(`localhost:${port} started`)
})