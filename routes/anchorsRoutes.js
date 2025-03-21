const express = require("express");
const authController = require("../controllers/authController");
const anchorsController = require("../controllers/anchorsController");
const rlm = require("realm")
const dbconnect = require("./../models/dbconnect")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const Anchors = require("../models/anchorsModel");
const FloorPlan = require("../models/floorplanModel")
const router = express.Router();


//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only

router.route('/details').post(anchorsController.getAnchorDetails);

router.route("/").get(authController.restrictTo("admin", "user"), anchorsController.getAllAnchors);

router.use(authController.restrictTo("admin"));


router.route("/").post(async (req, res) => {
 
  //const floorplan = req.body.floorplan;
  const hostname = req.body.hostname;
  const port = req.body.port;
  const configuration = req.body.configuration
 

  const realm = await dbconnect.getDBPointer()
  const floorId = rlm.BSON.ObjectID(req.body.floorplan)
  let floor = realm.objectForPrimaryKey(FloorPlan.name,floorId )
  
  if(!floor)
  {
    res.status(404).send("Cant find floorId");
    return
  }


  const floorplan = floor;
  const newAnchorData = {
    hostname,
    floorplan,
    port,
    configuration
  };

  try {
    
        
    newAnchorData._id = rlm.BSON.ObjectId()
    let ancData
    await realm.write(()=>{
        ancData=realm.create(Anchors.name, newAnchorData)
    })
    res.status(200).json(ancData);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
// END ADD FLOOR PLAN

router
  .route("/:id")
  .get(anchorsController.getAnchors)
  .patch(anchorsController.updateAnchors)
  .delete(anchorsController.deleteAnchors);
router.route("/floorplan/:id").get(authController.restrictTo("admin", "user"),anchorsController.getAnchorsByFloor)
module.exports = router;
