const express = require("express");
const authController = require("../controllers/authController");
//const anchorsController = require("../controllers/anchorsController");
const mqttController = require("../controllers/mqttController")
const rlm = require("realm")
const dbconnect = require("./../models/dbconnect")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const MQTT= require("../models/mqttModel");
const FloorPlan = require("../models/floorplanModel")
const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only


router.route("/").get(authController.restrictTo("admin", "user"), mqttController.getMQTT);

router.use(authController.restrictTo("admin"));


router.route("/").post(async (req, res) => {
 
  //const floorplan = req.body.floorplan;
  const hostname = req.body.host;
  const port = req.body.port;
  let username=null
  let password=null
  if(req.body.username)
  {
    username = req.body.username
  }


  if(req.body.password)
  {
    password =req.body.password
  }
  //const configuration = req.body.configuration
 

  const realm = await dbconnect.getDBPointer()

  //const floorplan = floor;
  const newMQTTData = {
    hostname,
    //floorplan,
    
    port,
    username,
    password,

    //configuration
  };

  try {
    
        
    newMQTTData._id = rlm.BSON.ObjectId()
    let MQTTData
    await realm.write(()=>{
        MQTTData=realm.create(MQTT.name, newMQTTData)
    })
    res.status(200).json(MQTTData);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
// END ADD FLOOR PLAN

router
  .route("/:id")
  .get(mqttController.getMQTT)
  .patch(async (req, res) => {
 
    //const floorplan = req.body.floorplan;
    const hostname = req.body.host;
    const port = req.body.port;
    const _id = req.params.id
    
    //const configuration = req.body.configuration
   
    let username=null
    let password=null
    if(req.body.username)
    {
    username = req.body.username
    }


     if(req.body.password)
    {
    password =req.body.password
    }
    const realm = await dbconnect.getDBPointer()
    const mqttId = rlm.BSON.ObjectID(_id)
    let mqttData= realm.objectForPrimaryKey(MQTT.name,mqttId )
    
    if(!mqttData)
    {
      res.status(404).send("Cant find mqtt record");
      return
    }
  
  
    //const floorplan = floor;
    const newMQTTData = {
      hostname,
      //floorplan,
      port,
      username,
      password,

      //configuration
    };
  
    try {
      
          
      newMQTTData._id = mqttId//rlm.BSON.ObjectId()
      let MQTTData
      await realm.write(()=>{
          MQTTData=realm.create(MQTT.name, newMQTTData,"modified")
      })
      res.status(200).json(MQTTData);
  
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  })
  .delete(mqttController.deleteMQTT);
//router.route("/floorplan/:id").get(authController.restrictTo("admin", "user"),anchorsController.getAnchorsByFloor)
module.exports = router;
