const UserModel = require("../../models/user");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


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



}
module.exports = UserController;
