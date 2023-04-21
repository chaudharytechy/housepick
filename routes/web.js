const express = require('express')
const AboutController = require('../controllers/admin/AboutController')
const AdminController = require('../controllers/admin/AdminController')
const BlogController = require('../controllers/admin/BlogController')
const ContactController = require('../controllers/admin/ContactController')
const PropertyController = require('../controllers/admin/PropertyController')
const SliderController = require('../controllers/admin/SliderController')
const TeamController = require('../controllers/admin/TeamController')
const FrontController = require('../controllers/FrontController')
const UserController = require('../controllers/user/UserController')
const router = express.Router()


//front controller
router.get('/',FrontController.home)
router.get('/about',FrontController.about)
router.get('/property',FrontController.property)
router.get('/blog',FrontController.blog)
router.get('/contact',FrontController.contact)
router.get('/property-detail/:id',FrontController.propertyDetail)
router.get('/sliderproperty-detail/:id',FrontController.sliderPropertyDetail)
router.get('/blog-detail/:id',FrontController.blogDetail)
router.get('/team-detail/:id',FrontController.teamDetail)
router.get('/login',FrontController.login)
router.get('/register',FrontController.register)
router.post('/propertysearch',FrontController.propertySearch)
router.post('/filterProperty',FrontController.filterProperty)



//admin controller
router.get('/admin/dashboard',AdminController.dashboard)



//slider controller
router.get('/admin/dashboard/slider',SliderController.sliderDisplay)
router.post('/sliderinsert',SliderController.sliderInsert)
router.get('/admin/dashboard/sliderview/:id',SliderController.sliderView)
router.get('/sliderdelete/:id',SliderController.sliderDelete)
router.get('/admin/dashboard/slideredit/:id',SliderController.sliderEdit)
router.post('/sliderupdate/:id',SliderController.sliderUpdate)



//property controller
router.get('/admin/dashboard/property',PropertyController.property)
router.post('/propertyinsert',PropertyController.propertyInsert)
router.get('/admin/dashboard/propertyview/:id',PropertyController.propertyView)
router.get('/admin/dashboard/propertyedit/:id',PropertyController.propertyEdit)
router.get('/propertydelete/:id',PropertyController.propertyDelete)
router.post('/propertyupdate/:id',PropertyController.propertyUpdate)
router.get('/singleimagedelete/:id/front-image/:public_id',PropertyController.singleImageDelete)



//about controller
router.get('/admin/dashboard/about',AboutController.aboutDisplay)
router.get('/admin/dashboard/aboutedit/:id',AboutController.aboutEdit)
router.post('/aboutupdate/:id',AboutController.aboutUpdate)


//blog controller
router.get('/admin/dashboard/blog',BlogController.blogDisplay)
router.post('/bloginsert',BlogController.blogInsert)
router.get('/admin/dashboard/blogview/:id',BlogController.blogView)
router.get('/admin/dashboard/blogedit/:id',BlogController.blogEdit)
router.post('/blogupdate/:id',BlogController.blogUpdate)
router.get('/blogdelete/:id',BlogController.blogDelete)


//contact controller
router.get('/admin/dashboard/contacts',ContactController.contactDisplay)
router.post('/contactinsert',ContactController.contactInsert)
router.get('/contactdelete/:id',ContactController.contactDelete)



//team controller
router.get('/admin/dashboard/team',TeamController.teamDisplay)
router.post('/teaminsert',TeamController.teamInsert)
router.get('/admin/dashboard/teamedit/:id',TeamController.teamEdit)
router.post('/teamupdate/:id',TeamController.teamUpdate)
router.get('/teamdelete/:id',TeamController.teamDelete)


// usercontroller 
router.post('/userregister',UserController.userRegister)
router.get('/verify/:id',UserController.verify)
router.post('/verifyotp/:id',UserController.verifyOtp)
router.get('/sendemail',UserController.sendEmail)



module.exports = router