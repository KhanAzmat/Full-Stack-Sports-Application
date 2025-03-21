

// const Floorplan = require("../models/floorplanModel");
// const GeoFence = require("../models/geoFenceModel");
// const Gltf = require("../models/gltfModel");
// const factory = require("./handlerFactory");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("./../utils/appError");
// const dbconnect = require("./../models/dbconnect")
// const rlm = require("realm")

const Server = require('../models/serverModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const dbconnect = require('./../models/dbconnect')
const relm = require('realm')
const { unlink } = require('node:fs')
// const path = require('node:path')


exports.getAllServers = factory.getAll(Server.name)
exports.getServer = factory.getOne(Server.name)
exports.updateServer = factory.updateOne(Server.name)

// exports.updateServer = catchAsync(async (req,res,next)=>{
//   const realm = await dbconnect.getDBPointer()
//   const serverId = relm.BSON.ObjectID(req.params.id)
//   const doc = realm.objectForPrimaryKey(Server.name, serverId)
//   console.log(doc)
//   if(!doc)
//     return next(new AppError('No Document found!!', 404))
//   docJson = doc.toJSON()
//   console.log(__dirname)
//   if(docJson.image){
//     deleteImage(docJson.image)
//     const image = req.file.filename;
//   }
    

  
  
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });


// })

exports.deleteServer = catchAsync(async (req, res, next)=>{
    const realm = await dbconnect.getDBPointer()
    const serverId = relm.BSON.ObjectID(req.params.id)
    const doc = realm.objectForPrimaryKey(Server.name, serverId)
    if(!doc){
        return next(new AppError('No Document found!!', 404))
    }

    docJson = doc.toJSON()
    console.log(__dirname)
    if(docJson.image)
      unlink(`client/build/uploads/serverImage/${docJson.image}`, err=>{
        if (err) throw err;
        console.log(`Successfully deleted ${docJson.image}`)}
        )

    await realm.write(()=>{
        realm.delete(doc)
    })

    res.status(204).json({
      status: "success",
      data: null,
    });
})

deleteImage = (image)=>{
  unlink(`client/build/uploads/serverImage/${image}`, err=>{
    if (err) throw err;
    console.log(`Successfully deleted ${image}`)}
    )
}
