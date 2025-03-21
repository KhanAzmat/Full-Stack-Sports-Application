const dbconnect = require("./../models/dbconnect")
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const { isValidObjectId, Mongoose, ObjectId,Types } = require("mongoose");
const rlm = require("realm")
const GeoFence = require("../models/geoFenceModel")
const Gltf = require("../models/gltfModel");
const Player = require('../models/playerModel')
const Anchors = require("../models/anchorsModel");
const LinkedTeamPlayer = require('../models/linkedTeamPlayer')
const LinkedTagPlayer = require('../models/linkedTagPlayer')
const MQTT = require("./../models/mqttModel")
const Tag = require("./../models/tagModel")
const gc = require("../geofence_control")
const Server = require('../models/serverModel')
const { unlink } = require('node:fs')

//const realm=  dbconnect.getDBPointer()

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //const doc = await Model.findByIdAndDelete(req.params.id);
    const realm = await dbconnect.getDBPointer()
     
    await realm.write(()=>{ 
      const  doc =  realm.objectForPrimaryKey(Model,rlm.BSON.ObjectID( req.params.id))
      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }
      realm.delete(doc)
      res.status(204).json({
        status: "success",
        data: null,
      })
    })
   
  });


exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('Files : ', req.file)
    console.log(req.body)
    console.log(req.params.id)
    console.log(Model)

    if(!req.params.id)
    {
      res.status(400).json({
        status: "Bad request missing id",
        data: {
          data: newdoc,
        },
      })
      return
    }
    const realm = await dbconnect.getDBPointer()
    const  doc =  realm.objectForPrimaryKey(Model, rlm.BSON.ObjectID(req.params.id))
    

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    } 
   
    if(Model ==Gltf.name)
    {
        const docTemp = doc.toJSON()
        req.body.floorplan = docTemp.floorplan
        req.body.ambiIntensity =Number( req.body.ambiIntensity);
  req.body.dirIntensity = Number(req.body.dirIntensity)
  req.body.scale = Number(req.body.scale)
  req.body.angle =  Number(req.body.angle)
  req.body.x = Number(req.body.x)
  req.body.y =Number( req.body.y)
  req.body.z =Number( req.body.z)
    }

if(Model ==Anchors.name)
{
  const docTemp = doc.toJSON()
  req.body.floorplan = docTemp.floorplan
}
 
if(Model == Server.name){
  const docJson = doc.toJSON()
  if(req.body.name){
    console.log(req.body.name.toLowerCase())
    const existingObj = realm.objects(Model).filtered('name == [c]$0', req.body.name.toLowerCase())
    if(Object.keys(existingObj).length !== 0)
      return next(new AppError("Server already exists", 404));
  }

  // Delete Image
  if(req.file){
    unlink(`client/build/uploads/serverImage/${docJson.image}`, err=>{
      if (err) throw err;
      console.log(`Successfully deleted ${docJson.image}`)}
      )
      req.body.image = req.file.filename
  }
  req.body.name = req.body.name?req.body.name:undefined
  req.body.location = req.body.location?req.body.location:undefined
}

console.log('Floorplan')
console.log(Model)
console.log(req.body)

await realm.write(()=>{
      req.body._id = rlm.BSON.ObjectID(req.params.id)
      let newdoc=realm.create(
        Model,
        req.body,
        "modified"
      );
    
      //console.log(newdoc.toJSON())
      if(Model == Tag.name)
      {
        newdoc = {_id:newdoc._id, tagId:newdoc.tagId,tagRegDate : newdoc.tagRegDate, height: newdoc.height}
        gc.processRestart()
        
      }

    // console.log(newdoc)
      res.status(200).json({
        status: "success",
        data: {
          data: newdoc,
        },
      })


    })


  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
  
    const realm = await dbconnect.getDBPointer()
    req.body._id = rlm.BSON.ObjectId()  
    await realm.write(()=>{ 
      const doc = realm.create(Model,req.body);

      res.status(201).json({
        status: "success",
        data: {
          data: doc,
        },
      });})
   
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id)
    //let query = Model.findById(req.params.id);
    //if (popOptions) query = query.populate(popOptions);
    //const doc = await query;
    const realm = await dbconnect.getDBPointer()
    //console.log(rlm.BSON.ObjectID(req.params.id))
    
    const  docr =  await realm.objectForPrimaryKey(Model,  rlm.BSON.ObjectID(req.params.id))
    //console.log(docr)
    const doc = docr.toJSON()
  // console.log(doc)
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    doc._id = doc._id.toString()   
    doc.id = doc._id.toString()
    
    res.status(200).json({
      status: "success",
      data: {
        data: doc
      },
    });
  });


exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
   const realm = await dbconnect.getDBPointer() 
   const docsR  = await realm.objects(Model)
   const docs = docsR.toJSON()
   console.log(docs);
   console.log('Model Name')
   console.log(Model)


   docs.forEach((doc)=>doc._id = doc._id.toString())
   if (Model ===GeoFence.name)
   {
       docs.forEach((doc)=>doc.location = JSON.parse(doc.location))
   }

   if(Model === Player.name){
    docs.forEach(doc=> doc.team = doc.team.length>0 ?
      {
      _id : doc.team[0].team._id.toString(),
      name : doc.team[0].team.name,
      image : doc.team[0].team.image,
      location : doc.team[0].team.location,
      color : doc.team[0].team.color,
      sports : doc.team[0].team.sports
    } : null)
   }

   if(Model === LinkedTagPlayer.name){
    docs.forEach((doc)=>doc.player = {
      _id : doc.player._id,
      name :  doc.player.name,
      initials : doc.player.initials,
      image : doc.player.image,
      color : doc.player.color,
})
//     doc.players.map(player=>
//       ({_id : player._id,
//         name :  player.name,
//         initials : player.initials,
//         image : player.image,
//     color : player.color,
// })))
   }

   if(Model === LinkedTeamPlayer.name){
    docs.forEach((doc)=>doc.players = doc.players.map(player=>
      ({_id : player._id,
        name :  player.name,
        initials : player.initials,
        image : player.image,
    color : player.color,
})))
   }
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs
    });
  });

/////////////////////Only for floorplan to gltf map and Anchors /////

exports.getByfloorplan = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log("valid id" + isValidObjectId(req.params.id))
    //const filter = {floorplan:Types.ObjectId(req.params.id)}
    
    /*const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const doc = await features.query;
    //console.log(doc)*/
  const realm = await dbconnect.getDBPointer()
   const docr = realm.objects(Model).filtered("floorplan._id==$0",rlm.BSON.ObjectID(req.params.id))
    
   //console.log(docr.toJSON())
    if (!docr) {
      console.log("404")
      return next(new AppError("No document found with that ID", 404));
    }
    
    let doc  
    if(Model === GeoFence.name)
     {
    doc  = docr.map(obj=>{
      let d =obj.toJSON()
      d._id = d._id.toString()
      d.floorplan._id = d.floorplan._id.toString()
      d.location = JSON.parse(d.location)
      return d
    })
  }
  else if(Model === Gltf.name || Model ===Anchors.name) 
  {

    doc  = docr.map(obj=>{
      let d =obj.toJSON()
      d._id = d._id.toString()
      d.floorplan._id = d.floorplan._id.toString()
      return d
    })


  }

    //console.log(doc)
   // const doc = docr[0].toJSON()
   // doc._id  = doc._id.toString()
   // doc.floorplan._id = doc.floorplan._id.toString()

    res.status(200).json({
      status: "success",
      results : doc.length,
        data: doc
    });
  });

///////////////Onlyfor linked tag//////////////


//TODO
  exports.getLinkedTagByTagId = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log("valid id" + isValidObjectId(req.params.id))
    const filter = {"tag.tagId": req.params.id}
    
    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const doc = await features.query;
   // console.log(doc)
    if (!doc) {
      console.log("404")
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      results : doc.length,
        data: doc
    });
  });








