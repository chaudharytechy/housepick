const SliderModel = require("../models/slider");
const PropertyModel = require("../models/property");
const AboutModel = require("../models/about");
const BlogModel = require("../models/blog");
const TeamModel = require("../models/team");

class FrontController {
  static home = async (req, res) => {
    try {
      const allCity = []
      const blog = await BlogModel.find().sort({ _id: -1 }).limit(4);
      const property = await PropertyModel.find().sort({ _id: -1 }).limit(4);
      const sliders = await SliderModel.find().sort({ _id: -1 });
      const team = await TeamModel.find().sort({ _id: -1 }).limit(3);
      // const allProperty = await PropertyModel.find()
      // for(let element of allProperty){
      //   allCity.push(element.city)
      // }
      // const allCityFilter = [... new Set(allCity)]
      // console.log(allCityFilter);

      res.render("index", {
        sliders: sliders,
        property: property,
        blog: blog,
        team: team
      });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const aboutdata = await AboutModel.findOne();
      const team = await TeamModel.find().sort({ _id: -1 });
      res.render("about", { item: aboutdata, team: team });
    } catch (error) {
      console.log(error);
    }
  };

  static property = async (req, res) => {
    try {
      const result = await PropertyModel.find().sort({ _id: -1 });
      res.render("property", { r: result });
    } catch (error) {
      console.log(error);
    }
  };

  static blog = async (req, res) => {
    try {
      const result = await BlogModel.find().sort({ _id: -1 });
      res.render("blog", { r: result });
    } catch (error) {
      console.log(error);
    }
  };

  static blogDetail = async (req, res) => {
    try {
      const result = await BlogModel.findById(req.params.id);
      res.render("blog-detail", { item: result });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      res.render("contact", {
        message: req.flash("success"),
        message1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static propertyDetail = async (req, res) => {
    try {
      const result = await PropertyModel.findById(req.params.id);
      res.render("property-detail", { item: result });
    } catch (error) {
      console.log(error);
    }
  };

  static sliderPropertyDetail = async (req, res) => {
    try {
      const result = await SliderModel.findById(req.params.id);
      res.render("slider_property_detail", { item: result });
    } catch (error) {
      console.log(error);
    }
  };

  static teamDetail = async (req, res) => {
    try {
      const data = await TeamModel.findById(req.params.id);
      res.render("team-detail", { item: data });
    } catch (error) {
      console.log(error);
    }
  };

  static login = (req, res) => {
    try {
      res.render("login", { message: req.flash("success") });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };

  static propertySearch = async (req, res)=>{
    // console.log(req.body);
    const location = req.body.location
    // console.log(location.length);
    if(location.length > 0){
      const data = await PropertyModel.find({"city":{$regex:location}})
      // console.log(data.length);
      res.render("searched_property",{data:data, location:location})
    }else{
      res.redirect('/')
    }
   
  }

  static filterProperty = async (req, res)=>{
    console.log(req.body);

    const data = req.body
    res.status(201).json({
      message:"success",
      data
    })
    // const {value, location} = req.params
    // console.log(value);
    // console.log(location);

    // const data = await PropertyModel.find({
    //   $and:[
    //     {"city":{$regex:location}},
    //     {"bedroom":value}
    //   ]
    // })

    // res.send(data)
    console.log("sended");
  }
}
module.exports = FrontController;
