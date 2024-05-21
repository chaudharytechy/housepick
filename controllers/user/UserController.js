const UserModel = require("../../models/user");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

class UserController {

  static async sendEmail(email,otp){
    const e = email
    const o = otp
    //connect with smtp gmail
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.Email,
        pass: process.env.EmailPass
      },
    })

    // send mail with defined transport object
let info = await transporter.sendMail({
  from: "test@gmail.com", // sender address
  to: e, // list of receivers
  subject: "EstateAgency verification code", // Subject line
  text: "Hello world?", // plain text body
  html: `<div><center><h2>Verify your email</h2></center></div><br><div>It seems you are registering at <b>Estate Agency</b> and trying to verify your email</div><div>Your email verification code is:</div><div><center><h2><b>${o}</b></h2></center></div><br><div>If this email is not intended to you please ignore and delete it.</div><br><div>Sincerely yours,</div><div>Estate Agency team</div>`, // html body
});

console.log("email sent")
  }


  static userRegister = async (req, res) => {
    // console.log(req.body);
    
    try {

      const { name, email, mobile, password, confirmpassword } = req.body;
      const getOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false });
      const user = await UserModel.findOne({ email: email });

      if (user && user.status=="verified") {
        req.flash("error", "Email already exists");
        res.redirect("/register");
      } else {
        if (name && email && mobile && password && confirmpassword) {
          if (password == confirmpassword) {
            const hashpassword = await bcrypt.hash(password, 10);
            const register = await new UserModel({
              status: "pending",
                name: name,
                email: email,
                mobile: mobile,
                role: "user",
                password: hashpassword,
                otp: {
                  code: getOtp,
                  expireIn: new Date().getTime() + 120*1000
                }
            });
            await register.save();

            console.log(getOtp)
            
            await this.sendEmail(email,getOtp)

            res.redirect(`/verify/${register._id}`)
          } else {
            req.flash("error", "Password and confirm password doesnot match");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All fields are required");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verify = async (req, res) => {
    // console.log(req.params.id)
    const userid = req.params.id
    res.render("verify",{u: userid});
  };


  static verifyOtp = async (req, res) =>{
    // console.log("this is verify otp")
    // console.log(req.body)
    const submitotp = req.body.otp
    console.log(submitotp)
    const data = await UserModel.findById(req.params.id)
    const currentTime = new Date().getTime()
    const diff = data.otp.expireIn - currentTime

    console.log(diff)

    if(diff <= 120000 && diff>=0){
      if(data.otp.code == submitotp){
      const status = await UserModel.findByIdAndUpdate(req.params.id,{
        status:"verified"
      })
      await status.save()

      req.flash("success", "Register successfully, Please login");
      res.redirect('/login')
      console.log("otp matched")
    }else{
      console.log("otp doesnot match")
    }
    }else{
      console.log("otp is expired")
    }
    
  }

  static verify_login=async(req,res)=>{
   try {
     const{email,password}=req.body
    
       if(email && password){
        const data=await UserModel.findOne({email:email})
        // console.log(data)
        if(data!=null){
          const is_match=await bcrypt.compare(password,data.password)
            if((data.email==email)&& is_match){
              if(data.role=='admin'){
                // token genrate
                const token = jwt.sign({ user_id: data._id }, 'Amitchaudharyid')
              //   console.log(token)
                res.cookie('token', token)
                res.redirect('/admin/dashboard')
             }else{
              const token = jwt.sign({ user_id: data._id }, 'Amitchaudharyid')
              // console.log(token)
              res.cookie('token', token)
              req.flash('msg','login Successfull')
              res.redirect('/')
             }

          }else{
            req.flash("error", "please check your email and password")
            res.redirect('/login')
          }
        }else{
          req.flash("error", "please check your email and password")
          res.redirect('/login')
        }
       }
   } catch (error) {
    console.log(error)
   }
  }



  static logout=async(req,res)=>{
       // console.log("log")
   try {
    res.clearCookie('token')

  res.redirect('/login')
} catch (error) {
  console.log(error)
}
}


static vivek=async(req,res)=>{

   console.log("hello")

    // send mail with defined transport object
    try {
      const { username, email, mobile } = req.body;
     console.log(req.body)
      // const ema=email
      if (mobile && username&&email) {
        // await sendPostEmail(email,number,projectName)
        const transporter = await nodemailer.createTransport({
          service: "gmail",
          port: 465,
          secure: true,
          logger: false,
          debug: true,
          secureConnection: false,
          auth: {
            // user: process.env.Email,
            // pass: process.env.EmailPass
            user: process.env.Email,
            pass: process.env.EmailPass
          },
          tls: {
            rejectUnAuthorized: true,
          },
        });
        console.log("hellohn")
        // Send mail with defined transport objec
        let info = await transporter.sendMail({
          from: process.env.Email, // Sender address
          to: "amit8601396382@gmail.com", // List of receivers (admin's email) =='query.aadharhomes@gmail.com' email
          subject: " Enquiry",
          html: `
                    <!DOCTYPE html>
                    <html lang:"en>
                    <head>
                    <meta charset:"UTF-8">
                    <meta http-equiv="X-UA-Compatible"  content="IE=edge">
                    <meta name="viewport"  content="width=device-width, initial-scale=1.0">
                    <title>New Enquiry</title>
                    </head>
                    <body>
                        <h3> Enquiry</h3>
                        <p>Customer Name : ${username}</p>
                        <p>Customer Email Id : ${email}</p>
                        <p>Customer Mobile Number : ${mobile} </p>
                       
                        <p>Thank you!</p>
                    </body>
                    </html>
            `,
        });

    
        res.status(201).json({
          message:"User data submitted successfully , and the data has been sent via email",
          // dataInsert: data
        });
      } else {
      res.status(400).json({
          message:"email not sent successfuly !"
      })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error ! ",
      });
    }

  

}
static deepak=async(req,res)=>{
  console.log("hello")
  const { username, email, mobile } = req.body;
    //connect with smtp gmail
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.Email,
        pass: process.env.EmailPass
      },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "amit100acre@gmail.com", // Sender address
      to: "amit8601396382@gmail.com", // List of receivers (admin's email) =='query.aadharhomes@gmail.com' email
      subject: "Enquiry",
      html: `
                <!DOCTYPE html>
                <html lang:"en>
                <head>
                <meta charset:"UTF-8">
                <meta http-equiv="X-UA-Compatible"  content="IE=edge">
                <meta name="viewport"  content="width=device-width, initial-scale=1.0">
                <title>New Enquiry</title>
                </head>
                <body>
                    <h3> Enquiry</h3>
                    <p>Customer Name : ${username}</p>
                    <p>Customer Email Id : ${email}</p>
                    <p>Customer Mobile Number : ${mobile} </p>
                   
                    <p>Thank you!</p>
                </body>
                </html>
        `,
    });


    res.status(201).json({
      message:
        "User data submitted successfully , and the data has been sent via email",
      // dataInsert: data
    });

}


  }

module.exports = UserController;
