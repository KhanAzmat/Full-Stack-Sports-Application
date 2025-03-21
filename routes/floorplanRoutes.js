const express = require("express");
const authController = require("./../controllers/authController");
const floorplanController = require("./../controllers/floorplanController");
const dbconnect = require("./../models/dbconnect")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const FloorPlan = require("../models/floorplanModel");
const rlm = require("realm")
const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);



// router.route("/").get(authController.restrictTo("admin", 'user'), floorplanController.getAllFloorplans);
router.route("/").get(floorplanController.getAllFloorplans);

// ADD  FLOOR  PLAN
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/build/uploads");
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

router.route("/").post(upload.single("floorplan"), async (req, res) => {

  //const doc = await FloorPlan.findOne({'floor': req.body.floor });
  
  const realm = await dbconnect.getDBPointer();
  const doc = realm.objects(FloorPlan.name).filtered("floorplan == $0", req.body.floor)

  if (doc.length > 0) {
    res.status(400).json(`The Floorplan for ${req.body.floor} floor already exists`);
  } else {
    const floorplan = req.file.filename;
    const floor = req.body.floor;
    //const building = req.body.building;
    const description = req.body.description;
  
    const newFloorplanData = {
      floorplan,
      floor,
      //building,
      description,
      _id : rlm.BSON.ObjectId()
    };
    let data
     await realm.write(()=>{
  
      data = realm.create(FloorPlan.name,newFloorplanData);
     })
    

  console.log(data.toJSON())
    res.status(204).json({
      status: "success",
      data: data.toJSON(),
    });
  }


 
});
// END ADD FLOOR PLAN

// router
//   .route("/:id")
//   .get(authController.restrictTo("admin", 'user'), floorplanController.getFloorplan)
//   .patch(authController.restrictTo("admin"), floorplanController.updateFloorplan)
//   .delete(authController.restrictTo("admin"), floorplanController.deleteFloorplan);

router
  .route("/:id")
  .get(floorplanController.getFloorplan)
  .patch( floorplanController.updateFloorplan)
  .delete( floorplanController.deleteFloorplan);



module.exports = router;
