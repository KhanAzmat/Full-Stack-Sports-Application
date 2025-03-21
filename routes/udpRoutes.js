const express = require("express");
const authController = require("../controllers/authController");
//const anchorsController = require("../controllers/anchorsController");
const udpController = require("../controllers/udpController")
const rlm = require("realm")
const dbconnect = require("./../models/dbconnect")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const UDP= require("../models/udpModel");
const FloorPlan = require("../models/floorplanModel")
const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only


router.route("/").get(authController.restrictTo("admin", "user"), udpController.getUDP);

router.use(authController.restrictTo("admin"));


router.route("/").post(async (req, res) => {
 
  //const floorplan = req.body.floorplan;
  const hostname = req.body.host;
  const port = req.body.port;
  //const configuration = req.body.configuration
 

  const realm = await dbconnect.getDBPointer()
  //const floorId = rlm.BSON.ObjectID(req.body.floorplan)
  //let floor = realm.objectForPrimaryKey(FloorPlan.name,floorId )
  
  //if(!floor)
  //{
    //res.status(404).send("Cant find floorId");
    //return
  //}


  //const floorplan = floor;
  const newUDPData = {
    hostname,
    //floorplan,
    port,
    //configuration
  };

  try {
    
        
    newUDPData._id = rlm.BSON.ObjectId()
    let UDPData
    await realm.write(()=>{
        UDPData=realm.create(UDP.name, newUDPData)
    })
    res.status(200).json(UDPData);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
// END ADD FLOOR PLAN

router
  .route("/:id")
  .get(udpController.getUDP)
  .patch(async (req, res) => {
 
    //const floorplan = req.body.floorplan;
    const hostname = req.body.host;
    const port = req.body.port;
    const _id = req.params.id
    //const configuration = req.body.configuration
   
  
    const realm = await dbconnect.getDBPointer()
    const udpId = rlm.BSON.ObjectID(_id)
    let udpData= realm.objectForPrimaryKey(UDP.name,udpId )
    
    if(!udpData)
    {
      res.status(404).send("Cant find udp record");
      return
    }
  
  
    //const floorplan = floor;
    const newUDPData = {
      hostname,
      //floorplan,
      port,
      //configuration
    };
  
    try {
      
          
      newUDPData._id = udpId//rlm.BSON.ObjectId()
      let UDPData
      await realm.write(()=>{
          UDPData=realm.create(UDP.name, newUDPData,"modified")
      })
      res.status(200).json(UDPData);
  
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  })
  .delete(udpController.deleteUDP);
//router.route("/floorplan/:id").get(authController.restrictTo("admin", "user"),anchorsController.getAnchorsByFloor)
module.exports = router;
