const mongoose = require("mongoose");
const GeoFence = require("../models/geoFenceModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
var request = require("request");
const fs=require("fs")
const mqtt = require("mqtt");
const { client } = require("websocket");
const  rlm = require("realm")
const dbconnect = require("../models/dbconnect")
const gm = require("geometric")
const Floorplan = require("../models/floorplanModel")
const gc = require("../geofence_control")

const options = {
  keepalive: 30,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};

options.clientId = `geofence_ + ${Math.random().toString(16).substr(2, 8)}`;



exports.createGeoFence = catchAsync(async (req, res, next) => {
  const { secondId } = req.body;
  const realm = await dbconnect.getDBPointer()
  try {
    // const geofence = await GeoFence.findOne({ secondId });

    // if (geofence) {
    //   return res.status(400).json("Geofence already exists");
    // }
    let coordarray = req.body.coordinates;
    coordarray.push(req.body.coordinates[0]);
    //console.log("coordinate Array",coordarray)

    
    
    
    let geoJsonCoordinates = [];
    geoJsonCoordinates.push(coordarray);


    const fenceType = req.body.geofenceType
    console.log("Geofence Type ",fenceType)
    if (fenceType !=="Location"  &&  fenceType !=="Monitoring")
    {
      res.status(406).json({message:"invalid geofence type"});
      return
    }

    const newGeofence = {
      secondId: req.body.secondId,
     
      name: req.body.name,
      description: req.body.description,
      color: req.body.color,
      floorplan: req.body.floorplan,
      warningZone:req.body.warningZone,
      dangerZone:req.body.dangerZone,
      geofenceType : fenceType,
      location:JSON.stringify( { type: "Polygon", coordinates: geoJsonCoordinates }),
    };


    const docs = await realm.objects(GeoFence.name).filtered("floorplan._id == $0 AND geofenceType == $1", rlm.BSON.ObjectID(req.body.floorplan), fenceType)
    let intersects = false
    docs.forEach(element => {
            
      
      let j =JSON.parse(element.location)
      let pola = j.coordinates[0]
      console.log(pola)
      let polb = coordarray 
      console.log(polb)
      
      if(gm.polygonIntersectsPolygon(pola, polb)  || gm.polygonInPolygon(pola, polb) || gm.polygonInPolygon(polb, pola))
      {
       
        intersects =true
        return
      }
    });

    console.log("fetched documents",docs.toJSON());
    if(intersects)
    {
      res.status(406).json({message:"intersects"});
    }
     else
     {
      
      // Monitoring fence mustbe within Location fence
      if(fenceType == "Monitoring") 
      {
        const docs = await realm.objects(GeoFence.name).filtered("floorplan._id == $0 AND geofenceType == $1", rlm.BSON.ObjectID(req.body.floorplan), "Location")
        let within = false
        docs.forEach(element => {
                
          
          let j =JSON.parse(element.location)
          let pola = j.coordinates[0]
          console.log(pola)
          let polb = coordarray 
          console.log(polb)
          
          if(gm.polygonInPolygon(polb, pola)) // Check monitoring geofence contained in Location geofence
          {
           
            within =true
            
          }
        });
        
        if(!within){
          res.status(406).json({message:"not in location"});
          return

        }
        
      }
      

      const floorId = rlm.BSON.ObjectID(req.body.floorplan)
      let floor = realm.objectForPrimaryKey(Floorplan.name,floorId )

      if(!floor)
      {
        res.status(406).json({message:"Invalid Floor Id"});
        return
      }
       await realm.write(()=>{
             
        newGeofence.floorplan = floor
        newGeofence.floor = floor.floor
        newGeofence._id = rlm.BSON.ObjectId()
        realm.create(GeoFence.name, newGeofence)

       }) 
      gc.processRestart()
      res.status(200).json("true");
      }
    // let result = await newGeofence.save();
    // res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

exports.getAllGeoFences = factory.getAll(GeoFence.name);
exports.getGeoFence = factory.getOne(GeoFence.name);
exports.updateGeoFence = factory.updateOne(GeoFence.name);
// exports.deleteGeoFence = factory.deleteOne(GeoFence);

exports.geofenceCount = catchAsync(async (req, res, next) => {
  //to allow for nested getReviews on tour (small hack)
  const docs = await GeoFence.countDocuments({});

  res.status(200).json({
    status: "success",
    data: docs,
  });
});


exports.deleteGeo = catchAsync(async (req, res, next) => {
  //to allow for nested getReviews on tour (small hack)
  //const doc = await GeoFence.deleteOne({ _id: req.params.deleteId });
 
  const realm = await dbconnect.getDBPointer()
  const geofence_id = rlm.BSON.ObjectId(req.params.deleteId)
  const doc = realm.objectForPrimaryKey(GeoFence.name,geofence_id)
  //console.log(doc.toJSON())


  if (!doc) {
    //return next(new AppError("No document found with that ID", 404));
    res.status(404).json({message:"Geofence not found"})
    return

  }


  if(doc.geofenceType ==="Location")
  {
    
    //const data = doc.toJSON()
    console.log(doc.location)
    let pols = JSON.parse(doc.location)
    console.log(pols)

    const docs = await realm.objects(GeoFence.name).filtered("floorplan._id == $0 AND geofenceType != $1", rlm.BSON.ObjectID(doc.floorplan._id), "Location")
        let within = false
        docs.forEach(element => {
                
          
          let j =JSON.parse(element.location)
          let pola = j.coordinates[0]
          console.log(pola)
          //console.log(data)
          //console.log(data.coordinates)
          
          console.log(pola)
          let polb = pols.coordinates[0]
                    //doc.coordinates[0] // coordinate of location type geofence
          console.log(polb)
          
          if(gm.polygonInPolygon(pola, polb)) // Check monitoring geofence contained in Location geofence
          {
           
            within =true
            
          }
        });
        
        if(within){
          res.status(406).json({message:"Monitor geofence exists"});
          return

        }
  }

  await realm.write(()=>{
    realm.delete(doc)
  })


 gc.processRestart()
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.findIntersect = catchAsync(async (req, res, next) => {
  let coordarray = req.body.coordinates;
  coordarray.push(req.body.coordinates[0]);

  let geoJsonCoordinates = [];
  geoJsonCoordinates.push(coordarray);

  const docs = await GeoFence.find({
    location: {
      $geoIntersects: {
        $geometry: { type: "Polygon", coordinates: geoJsonCoordinates },
      },
    },
  });

  res.json(docs);
});



exports.getFeofenceByFloor=factory.getByfloorplan(GeoFence.name)
