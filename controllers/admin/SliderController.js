const SliderModel = require("../../models/slider");
var cloudinary = require("cloudinary").v2;

class SliderController {
  static sliderDisplay = async (req, res) => {
    try {
      const display = await SliderModel.find().sort({ _id: -1 });
      res.render("admin/slider/slider_display", {
        sliderdata: display,
        message: req.flash("success"),
        message1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static sliderInsert = async (req, res) => {
    try {
      const {
        property_name,
        state,
        city,
        address,
        pincode,
        description,
        price,
        type,
        area,
        bedroom,
        bathroom,
        garage,
        amenities,
      } = req.body;

      if (
        property_name &&
        state &&
        city &&
        address &&
        pincode &&
        description &&
        price &&
        type &&
        area &&
        bedroom &&
        bathroom &&
        garage &&
        amenities &&
        req.files
      ) {
        const file = req.files.slider_image;
        const image = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "estate-agency",
        });

        const insert = await new SliderModel({
          slider_image: {
            public_id: image.public_id,
            url: image.secure_url,
          },
          property_name: req.body.property_name,
          state: req.body.state,
          city: req.body.city,
          address: req.body.address,
          pincode: req.body.pincode,
          description: req.body.description,
          price: req.body.price,
          type: req.body.type,
          area: req.body.area,
          bedroom: req.body.bedroom,
          bathroom: req.body.bathroom,
          garage: req.body.garage,
          amenities: req.body.amenities,
        });
        await insert.save();
        req.flash("success", "Slider image uploaded successfully.");
        res.redirect("/admin/dashboard/slider");
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/admin/dashboard/slider");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sliderView = async (req, res) => {
    try {
      const result = await SliderModel.findOne({ _id: req.params.id });
      res.render("admin/slider/slider_view", { view: result });
    } catch (error) {
      console.log(error);
    }
  };

  static sliderEdit = async (req, res) => {
    try {
      const result = await SliderModel.findOne({ _id: req.params.id });
      res.render("admin/slider/slider_edit", { item: result });
    } catch (error) {
      console.log(error);
    }
  };

  static sliderUpdate = async (req, res) => {
    try {
      const {
        property_name,
        state,
        city,
        address,
        pincode,
        description,
        price,
        type,
        area,
        bedroom,
        bathroom,
        garage,
        amenities,
      } = req.body;

      if (req.files) {
        if (
          property_name &&
          state &&
          city &&
          address &&
          pincode &&
          description &&
          price &&
          type &&
          area &&
          bedroom &&
          bathroom &&
          garage &&
          amenities &&
          req.files
        ) {
          const data = await SliderModel.findById(req.params.id);
          const imageid = data.slider_image.public_id;
          await cloudinary.uploader.destroy(imageid);

          const file = req.files.slider_image;
          const imageinsert = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
              folder: "estate-agency",
            }
          );

          const update = await SliderModel.findByIdAndUpdate(req.params.id, {
            slider_image: {
              public_id: imageinsert.public_id,
              url: imageinsert.secure_url,
            },
            property_name: req.body.property_name,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            pincode: req.body.pincode,
            description: req.body.description,
            price: req.body.price,
            type: req.body.type,
            area: req.body.area,
            bedroom: req.body.bedroom,
            bathroom: req.body.bathroom,
            garage: req.body.garage,
            amenities: req.body.amenities,
          });
          await update.save();
          req.flash("success", "Slider image updated successfully");
          res.redirect("/admin/dashboard/slider");
        } else {
          req.flash(
            "error",
            "Slider image is not updated. All fields are required"
          );
          res.redirect("/admin/dashboard/slider");
        }
      } else {
        if (
          property_name &&
          state &&
          city &&
          address &&
          pincode &&
          description &&
          price &&
          type &&
          area &&
          bedroom &&
          bathroom &&
          garage &&
          amenities
        ) {
          const update = await SliderModel.findByIdAndUpdate(req.params.id, {
            property_name: req.body.property_name,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            pincode: req.body.pincode,
            description: req.body.description,
            price: req.body.price,
            type: req.body.type,
            area: req.body.area,
            bedroom: req.body.bedroom,
            bathroom: req.body.bathroom,
            garage: req.body.garage,
            amenities: req.body.amenities,
          });
          await update.save();
          req.flash("success", "Slider image updated successfully");
          res.redirect("/admin/dashboard/slider");
        } else {
          req.flash(
            "error",
            "Slider image is not updated. All fields are required"
          );
          res.redirect("/admin/dashboard/slider");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sliderDelete = async (req, res) => {
    try {
      const result = await SliderModel.findById(req.params.id);
      const imageid = result.slider_image.public_id;
      await cloudinary.uploader.destroy(imageid);
      await SliderModel.findByIdAndDelete(req.params.id);
      req.flash("success", "Slider image deleted successfully.");
      res.redirect("/admin/dashboard/slider");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = SliderController;
