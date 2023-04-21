const TeamModel = require("../../models/team");
const cloudinary = require("cloudinary").v2;

class TeamController {
  static teamDisplay = async (req, res) => {
    try {
      const result = await TeamModel.find().sort({ _id: -1 });
      res.render("admin/team/team_display", {
        data: result,
        message: req.flash("success"),
        message1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static teamInsert = async (req, res) => {
    try {
      const { name, email, designation, mobile, about } = req.body;

      if (name && email && designation && mobile && about) {
        if (req.files) {
          const image = req.files.image;

          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "housepick/teamImage",
          });

          const insert = new TeamModel({
            image: {
              public_id: result.public_id,
              url: result.secure_url,
            },
            name: name,
            email: email,
            designation: designation,
            mobile: mobile,
            about: about,
          });

          await insert.save();
          req.flash("success", "Team member added successfully.");
          res.redirect("/admin/dashboard/team");
        } else {
          req.flash("error", "All fields are required");
          res.redirect("/admin/dashboard/team");
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/admin/dashboard/team");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static teamEdit = async (req, res) => {
    try {
      const data = await TeamModel.findById(req.params.id);
      res.render("admin/team/team_edit", { item: data });
    } catch (error) {
      console.log(error);
    }
  };

  static teamUpdate = async (req, res) => {
    try {
      const { name, designation, mobile, email, about } = req.body;

      if (name && email && designation && mobile && about) {
        if (req.files) {
          const image = req.files.image;

          const data = await TeamModel.findById(req.params.id);
          const imageid = data.image.public_id;

          await cloudinary.uploader.destroy(imageid);

          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "housepick/teamImage",
          });

          const update = await TeamModel.findByIdAndUpdate(req.params.id, {
            image: {
              public_id: result.public_id,
              url: result.secure_url,
            },
            name: name,
            designation: designation,
            mobile: mobile,
            email: email,
            about: about,
          });

          await update.save();
          req.flash("success", "Team details updated successfully");
          res.redirect("/admin/dashboard/team");
        } else {
          const update = await TeamModel.findByIdAndUpdate(req.params.id, {
            name: name,
            designation: designation,
            mobile: mobile,
            email: email,
            about: about,
          });

          await update.save();
          req.flash("success", "Team details updated successfully");
          res.redirect("/admin/dashboard/team");
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/admin/dashboard/team");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static teamDelete = async (req, res) => {
    try {
      const data = await TeamModel.findById(req.params.id);
      const imageid = data.image.public_id;

      await cloudinary.uploader.destroy(imageid);
      await TeamModel.findByIdAndDelete(req.params.id);
      req.flash("success", "Team member deleted successfully");
      res.redirect("/admin/dashboard/team");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = TeamController;
