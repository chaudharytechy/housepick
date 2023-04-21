const PropertyModel = require("../../models/property");
const cloudinary = require("cloudinary").v2;

class PropertyController {
  static property = async (req, res) => {
    try {
      const result = await PropertyModel.find().sort({_id:-1});
      res.render("admin/property/property_display", {
        r: result,
        message: req.flash("success"),
        message1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static propertyInsert = async (req, res) => {
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
        if (req.files.front_image && req.files.all_image) {
          const frontImage = req.files.front_image;
          const allImage = req.files.all_image;

          const allImageLink = [];

          const frontImageResult = await cloudinary.uploader.upload(
            frontImage.tempFilePath,
            { folder: "front-image" }
          );

          for (let i = 0; i < allImage.length; i++) {
            const allImageResult = await cloudinary.uploader.upload(
              allImage[i].tempFilePath,
              { folder: "front-image" }
            );

            allImageLink.push({
              public_id: allImageResult.public_id,
              url: allImageResult.secure_url,
            });
          }

          const insert = new PropertyModel({
            front_image: {
              public_id: frontImageResult.public_id,
              url: frontImageResult.secure_url,
            },
            all_image: allImageLink,
            property_name: property_name,
            state: state,
            city: city,
            address: address,
            pincode: pincode,
            description: description,
            price: price,
            type: type,
            area: area,
            bedroom: bedroom,
            bathroom: bathroom,
            garage: garage,
            amenities: amenities,
          });

          await insert.save();
          req.flash("success", "Property details added succesfully");
          res.redirect("/admin/dashboard/property");
        } else {
          req.flash("error", "All fields are required");
          res.redirect("/admin/dashboard/property");
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/admin/dashboard/property");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static propertyView = async (req, res) => {
    try {
      const view = await PropertyModel.findById(req.params.id);
      res.render("admin/property/property_view", { view: view });
    } catch (error) {
      console.log(error);
    }
  };

  static propertyEdit = async (req, res) => {
    try {
      const result = await PropertyModel.findById(req.params.id);
      res.render("admin/property/property_edit", { data: result });
    } catch (error) {
      console.log(error);
    }
  };

  static singleImageDelete = async (req, res) => {
    const imageid = "front-image/" + req.params.public_id;
    await cloudinary.uploader.destroy(imageid);
    const result = await PropertyModel.findById(req.params.id);
    const index = result.all_image.findIndex((img) => img.public_id == imageid);
    const removeindex = result.all_image.splice(index, 1);
    const updatedImageLinks = result.all_image;
    const update = await PropertyModel.findByIdAndUpdate(req.params.id, {
      all_image: updatedImageLinks,
    });
    await update.save();
    res.redirect("/admin/dashboard/propertyedit/" + req.params.id);
  };

  static propertyUpdate = async (req, res) => {
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
        amenities
      ) {
        if (req.files) {
          if (req.files.front_image && req.files.all_image) {
            const frontImage = req.files.front_image;
            const allImage = req.files.all_image;
            const allImageLink = [];

            const data = await PropertyModel.findById(req.params.id);
            const frontimageid = data.front_image.public_id;
            await cloudinary.uploader.destroy(frontimageid);

            const frontImageResult = await cloudinary.uploader.upload(
              frontImage.tempFilePath,
              { folder: "front-image" }
            );

            if (allImage.length >= 2) {
              for (let i = 0; i < allImage.length; i++) {
                const allImageResult = await cloudinary.uploader.upload(
                  allImage[i].tempFilePath,
                  { folder: "front-image" }
                );

                allImageLink.push({
                  public_id: allImageResult.public_id,
                  url: allImageResult.secure_url,
                });
              }
            } else {
              const imageresult = await cloudinary.uploader.upload(
                allImage.tempFilePath,
                {
                  folder: "front-image",
                }
              );

              allImageLink.push({
                public_id: imageresult.public_id,
                url: imageresult.secure_url,
              });
            }

            const result = await PropertyModel.findById(req.params.id);
            for (let i = 0; i < result.all_image.length; i++) {
              allImageLink.push(result.all_image[i]);
            }

            const update = await PropertyModel.findByIdAndUpdate(
              req.params.id,
              {
                front_image: {
                  public_id: frontImageResult.public_id,
                  url: frontImageResult.secure_url,
                },
                all_image: allImageLink,
                property_name: property_name,
                state: state,
                city: city,
                address: address,
                pincode: pincode,
                description: description,
                price: price,
                type: type,
                area: area,
                bedroom: bedroom,
                bathroom: bathroom,
                garage: garage,
                amenities: amenities,
              }
            );
            await update.save();
            req.flash("success", "Property details updated succesfully");
            res.redirect("/admin/dashboard/property");
          } else if (req.files.front_image) {
            const frontImage = req.files.front_image;

            const data = await PropertyModel.findById(req.params.id);
            const frontimageid = data.front_image.public_id;
            await cloudinary.uploader.destroy(frontimageid);

            const frontImageResult = await cloudinary.uploader.upload(
              frontImage.tempFilePath,
              { folder: "front-image" }
            );

            const update = await PropertyModel.findByIdAndUpdate(
              req.params.id,
              {
                front_image: {
                  public_id: frontImageResult.public_id,
                  url: frontImageResult.secure_url,
                },
                property_name: property_name,
                state: state,
                city: city,
                address: address,
                pincode: pincode,
                description: description,
                price: price,
                type: type,
                area: area,
                bedroom: bedroom,
                bathroom: bathroom,
                garage: garage,
                amenities: amenities,
              }
            );
            await update.save();
            req.flash("success", "Property details updated succesfully");
            res.redirect("/admin/dashboard/property");
          } else if (req.files.all_image) {
            const allImage = req.files.all_image;
            const allImageLink = [];

            if (allImage.length >= 2) {
              for (let i = 0; i < allImage.length; i++) {
                const allImageResult = await cloudinary.uploader.upload(
                  allImage[i].tempFilePath,
                  { folder: "front-image" }
                );

                allImageLink.push({
                  public_id: allImageResult.public_id,
                  url: allImageResult.secure_url,
                });
              }
            } else {
              const imageresult = await cloudinary.uploader.upload(
                allImage.tempFilePath,
                {
                  folder: "front-image",
                }
              );

              allImageLink.push({
                public_id: imageresult.public_id,
                url: imageresult.secure_url,
              });
            }

            const result = await PropertyModel.findById(req.params.id);
            for (let i = 0; i < result.all_image.length; i++) {
              allImageLink.push(result.all_image[i]);
            }

            const update = await PropertyModel.findByIdAndUpdate(
              req.params.id,
              {
                all_image: allImageLink,
                property_name: property_name,
                state: state,
                city: city,
                address: address,
                pincode: pincode,
                description: description,
                price: price,
                type: type,
                area: area,
                bedroom: bedroom,
                bathroom: bathroom,
                garage: garage,
                amenities: amenities,
              }
            );
            await update.save();
            req.flash("success", "Property details updated succesfully");
            res.redirect("/admin/dashboard/property");
          }
        } else {
          const update = await PropertyModel.findByIdAndUpdate(req.params.id, {
            property_name: property_name,
            state: state,
            city: city,
            address: address,
            pincode: pincode,
            description: description,
            price: price,
            type: type,
            area: area,
            bedroom: bedroom,
            bathroom: bathroom,
            garage: garage,
            amenities: amenities,
          });
          await update.save();
          req.flash("success", "Property details updated succesfully");
          res.redirect("/admin/dashboard/property");
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/admin/dashboard/property");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static propertyDelete = async (req, res) => {
    try {
      const result = await PropertyModel.findById(req.params.id);
      const frontImageId = result.front_image.public_id;
      await cloudinary.uploader.destroy(frontImageId);
      for (let i = 0; i < result.all_image.length; i++) {
        const allImageId = result.all_image[i].public_id;
        await cloudinary.uploader.destroy(allImageId);
      }

      await PropertyModel.findByIdAndDelete(req.params.id);
      req.flash("success", "Property deleted successfully");
      res.redirect("/admin/dashboard/property");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = PropertyController;
