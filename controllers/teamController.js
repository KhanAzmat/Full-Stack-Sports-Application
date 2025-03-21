const Team = require('../models/teamModel')
const LinkedTagPlayer = require('../models/linkedTagPlayer')
const LinkedTeamToPlayer = require('../models/linkedTeamPlayer')
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const dbconnect = require("./../models/dbconnect")
const rlm = require("realm")
const { unlink } = require('node:fs')

exports.getAllTeams = factory.getAll(Team.name)
exports.updateTeam = catchAsync(async(req,res,next)=>{
    console.log(req.body)
    console.log('Files : ', req.file)
    const realm = await dbconnect.getDBPointer()
    const doc = await realm.objectForPrimaryKey(Team.name, rlm.BSON.ObjectID(req.params.id))
    if(!doc){
      return next(new AppError("No Player found with that ID", 404));
    }
  
    const docJson = doc.toJSON()
    if(req.body.name){
      nameCheck = req.body.name?req.body.name:docJson.name
      console.log(req.body.name.toLowerCase())
      const existingObj = realm.objects(Team.name).filtered('name == [c]$0', nameCheck.toLowerCase())
      if(Object.keys(existingObj).length !== 0)
        return next(new AppError("Player already exists", 404));
    }
    if(req.file && docJson.image){
      deleteImage(docJson.image)
        // req.body.image = req.file.filename
    }
    req.body.name = req.body.name?req.body.name:docJson.name
    req.body.location = req.body.location?req.body.location:docJson.location
    req.body.image = req.file?.filename ? req.file.filename: undefined
    req.body.sports = req.body.sports?req.body.sports:undefined
    req.body.color = req.body.color?req.body.color:undefined
    await realm.write(()=>{
      req.body._id = rlm.BSON.ObjectID(req.params.id)
      let newdoc=realm.create(
        Team.name,
        req.body,
        "modified"
      );
    
      res.status(200).json({
        status: "success",
        data: {
          data: newdoc,
        },
      })
  
  
    })
  })
exports.deleteTeam = catchAsync(async (req, res, next) => {
  
    //const doc = await Player.findByIdAndDelete(req.params.id);
    const realm = await dbconnect.getDBPointer()
    const doc = await realm.objectForPrimaryKey(Team.name,rlm.BSON.ObjectID(req.params.id))
  
    if (!doc) {
      return next(new AppError("No Team found with that ID", 404));
    }
  
    //await LinkedTag.findOneAndDelete({ Player: req.params.id });
     
    const docJson = doc.toJSON()
    if(docJson.image)
      deleteImage(docJson.image)
    realm.write(()=>{
          let linkedDocs = realm.objects(LinkedTeamToPlayer.name).filtered("team._id==$0", rlm.BSON.ObjectID(req.params.id))
          if(linkedDocs.length > 0)
            realm.delete(linkedDocs)
        realm.delete(doc)
    })
    res.status(204).json({
      status: "success",
      data: null,
    });
  })


// exports.addPlayers = catchAsync(async(req,res,next)=>{
//   const realm = await dbconnect.getDBPointer()
//   const doc = await realm.objectForPrimaryKey(Team.name, rlm.BSON.ObjectID(req.params.id))

//   if (!doc) {
//     return next(new AppError("No Team found with that ID", 404));
//   }

//   const docJson = doc.toJSON()
//   if(req.body.players){
//     nameCheck = req.body.name?req.body.name:docJson.name
//     console.log(req.body.name.toLowerCase())
//     const existingObj = realm.objects(Team.name).filtered('name == [c]$0', nameCheck.toLowerCase())
//     if(Object.keys(existingObj).length !== 0)
//       return next(new AppError("Player already exists", 404));
//   }
//   if(req.file){
//     deleteImage(docJson.image)
//       // req.body.image = req.file.filename
//   }
//   req.body.name = req.body.name?req.body.name:docJson.name
//   req.body.location = req.body.location?req.body.location:docJson.location
//   req.body.image = req.file?.filename ? req.file.filename: undefined
//   req.body.sports = req.body.sports?req.body.sports:undefined
//   req.body.color = req.body.color?req.body.color:undefined
//   req.body.players = req.body.players?req.body.players:docJson.players
//   await realm.write(()=>{
//     req.body._id = rlm.BSON.ObjectID(req.params.id)
//     let newdoc=realm.create(
//       Team.name,
//       req.body,
//       "modified"
//     );
  
//     res.status(200).json({
//       status: "success",
//       data: {
//         data: newdoc,
//       },
//     })


//   })

// })

  const deleteImage = (fileName)=>{
    unlink(`client/build/uploads/teamImage/${fileName}`, err=>{
      if (err) throw err;
      console.log(`Successfully deleted ${fileName}`)}
      )
  }
