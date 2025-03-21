
const express = require("express");
const JIMP = require('jimp')
const authController = require("./../controllers/authController");
const employeeController = require("./../controllers/employeeController");

const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");




//This function will create small icon for tag display
function createIcon(req,res,next){
  const file = req.file.filename
  const filename = extension = file.substring(0,file.lastIndexOf('.'))
  const path = "client/build/uploads/emp/" + file
  JIMP.read(path)
  .then(img => {
    return img
      .resize(70, 70) // resize
      .quality(10) 
      .circle()
      .write("client/build/uploads/stamp/" + filename +".png"); // save
  })
  .catch(err => {
    console.error(err);
  });
  
  next()

}

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("admin"));

router.route("/").get(employeeController.getAllEmployees);

// ADD  FLOOR  PLAN
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/build/uploads/emp");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.route("/").post(upload.single("image"),createIcon,employeeController.createEmployee);
router
  .route("/:id")
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
