const AboutModel = require("../../models/about");
const cloudinary = require("cloudinary").v2;

class AboutController {
  static aboutDisplay = async (req, res) => {
    try {
      const data = await AboutModel.findOne();
      res.render("admin/about/about_display", {
        item: data,
        message: req.flash("success"),
        message1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static aboutEdit = async (req, res) => {
    try {
      const data = await AboutModel.findById(req.params.id);
      res.render("admin/about/about_edit", { item: data });
    } catch (error) {
      console.log(error);
    }
  };

  static aboutUpdate = async (req, res) => {
    try {
      const { main_heading, description_heading, description } = req.body;

      if (main_heading && description_heading && description) {
        if (req.files) {
          const aboutImage = req.files.image;

          const data = await AboutModel.findById(req.params.id);
          const imageid = data.image.public_id;
          await cloudinary.uploader.destroy(imageid);

          const imageresult = await cloudinary.uploader.upload(
            aboutImage.tempFilePath,
            {
              folder: "housepick/about image",
            }
          );

          const update = await AboutModel.findByIdAndUpdate(req.params.id, {
            main_heading: main_heading,
            description_heading: description_heading,
            image: {
              public_id: imageresult.public_id,
              url: imageresult.secure_url,
            },
            description: description,
          });
          await update.save();
          req.flash("success", "About details updated successfully.");
          res.redirect("/admin/dashboard/about");
        } else {
          const update = await AboutModel.findByIdAndUpdate(req.params.id, {
            main_heading: main_heading,
            description_heading: description_heading,
            description: description,
          });
          await update.save();
          req.flash("success", "About details updated successfully.");
          res.redirect("/admin/dashboard/about");
        }
      } else {
        req.flash("error", "All fields are required.");
        res.redirect("/admin/dashboard/about");
      }
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = AboutController;
