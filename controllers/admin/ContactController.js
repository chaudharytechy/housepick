const ContactModel = require('../../models/contact')

class ContactController{

    static contactDisplay = async (req, res)=>{
        try{
            const result = await ContactModel.find().sort({_id: -1})
            res.render("admin/contact/contact_display",{data:result, message:req.flash('success')})
        }catch(error){
            console.log(error);
        }
    }

    static contactInsert = async (req, res)=>{
        try{
            const {name, email, subject, message} = req.body
            if(name && email && subject && message){
                const insert = new ContactModel({
                    name:name,
                    email:email,
                    subject:subject,
                    message:message
                })
                await insert.save()
                req.flash('success','Your message has been sent. Thank you!')
                res.redirect('/contact')
            }else{
                req.flash('error','Please fill out all fields.')
                res.redirect('/contact')
            }
            
        }catch(error){
            console.log(error);
        }
    }


    static contactDelete = async (req, res)=>{
        try{
            await ContactModel.findByIdAndDelete(req.params.id)
            req.flash('success','Contact deleted successfully.')
            res.redirect('/admin/dashboard/contacts')
        }catch(error){
            console.log(error);
        }
    }



}
module.exports = ContactController