const Player = require("../models/playerModel");
const LinkedTagToPlayer = require('../models/linkedTagPlayer')
const LinkedTeamToPlayer = require('../models/linkedTeamPlayer')
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const rlm = require("realm")
const dbconnect = require("../models/dbconnect")
const { unlink } = require('node:fs')

exports.createPlayer = catchAsync(async (req, res, next) => {

    console.log('Files : ', req.file)
   const realm = await dbconnect.getDBPointer()

  //const doc = await Player.findOne({playerId: req.body.playerId});
  const doc = await realm.objects(Player.name).filtered("name == $0 && initials == $1", req.body.name, req.body.initials)

console.log(req.body)

    if (doc.length > 0) {
     res.status(400).json("This player already exists");
  } else {
//    const name = req.body.name
//    const image = req.file === undefined? undefined:req.file.filename
//    const initials = req.body.initials?req.body.initials:undefined
//    const team = req.body.team ? req.body.team:undefined
//    const color = req.body.color? req.body.color:undefined

    const name = req.body.name
    const image = req.file ? req.file.filename: undefined
    const initials = req.body.initials
    const team = req.body.team
    const color = req.body.color


   const playerData = {
     name,
     image,
     initials,
     team,
     color,
     _id : rlm.BSON.ObjectId()
   }


    //const data =  await player.create(playerData);
   let data
    await realm.write(()=>{
     data = realm.create(Player.name, playerData)

   })
 
   const docsR  = await realm.objects(Player.name)
   const docs = docsR.toJSON()
   docs.forEach((doc)=>doc._id = doc._id.toString())
   docs.forEach(doc=> doc.team = doc.team.length>0 ?
    {
    _id : doc.team[0].team._id.toString(),
    name : doc.team[0].team.name,
    image : doc.team[0].team.image,
    location : doc.team[0].team.location,
    color : doc.team[0].team.color,
    sports : doc.team[0].team.sports
  } : null)

    // res.status(200).json({
    //   status: "success",
    //   data: data,
    // });

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs
    });

    console.log(data.toJSON())
  }
  

});

exports.getAllPlayers = factory.getAll(Player.name);
exports.getPlayer = factory.getOne(Player.name);
exports.updatePlayer = catchAsync(async(req,res,next)=>{
  console.log(req.body)
  console.log('Files : ', req.file)
  const realm = await dbconnect.getDBPointer()
  const doc = await realm.objectForPrimaryKey(Player.name, rlm.BSON.ObjectID(req.params.id))
  if(!doc){
    return next(new AppError("No Player found with that ID", 404));
  }

  const docJson = doc.toJSON()
  if(req.body.name || req.body.initials){
    nameCheck = req.body.name?req.body.name:docJson.name
    initialsCheck = req.body.initials?req.body.initials:docJson.initials
    console.log(req.body.name.toLowerCase())
    const existingObj = realm.objects(Player.name).filtered('name == [c]$0 && initials == [c]$1', nameCheck.toLowerCase(), initialsCheck.toLowerCase())
    if(Object.keys(existingObj).length !== 0)
      return next(new AppError("Player already exists", 404));
  }
  if(req.file){
    console.log('Image : ',docJson.image)
    if(docJson.image !== null)
    deleteImage(docJson.image)
      // req.body.image = req.file.filename
  }
  console.log('Request Body : ')
  console.log(req.body)
  req.body.name = req.body.name?req.body.name:docJson.name
  req.body.initials = req.body.initials?req.body.initials:docJson.initials
  req.body.image = req.file?.filename ? req.file.filename: undefined
  req.body.team = req.body.team?req.body.team:undefined
  req.body.color = req.body.color?req.body.color:undefined
  await realm.write(()=>{
    req.body._id = rlm.BSON.ObjectID(req.params.id)
    let newdoc=realm.create(
      Player.name,
      req.body,
      "modified"
    );
  console.log(newdoc.toJSON())
  let doc = {
    _id : newdoc._id.toString(),
    name : newdoc.name,
    initials : newdoc.initials,
    color : newdoc.colr,
    image : newdoc.image,
    active : newdoc.active,
    team : newdoc.team.length>0? {
      _id : newdoc.team[0].team._id.toString(),
      name : newdoc.team[0].team.name,
      image : newdoc.team[0].team.image,
      location : newdoc.team[0].team.location,
      color : newdoc.team[0].team.color,
      sports : newdoc.team[0].team.sports
    }:null
  }
    // newdoc.team = newdoc.team.length>0? {
    //   _id : newdoc.team[0].team._id.toString(),
    //   name : newdoc.team[0].team.name,
    //   image : newdoc.team[0].team.image,
    //   location : newdoc.team[0].team.location,
    //   color : newdoc.team[0].team.color,
    //   sports : newdoc.team[0].team.sports
    // }:null
    console.log(doc)
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    })


  })
})


////Need to delete image when deleting record (Yet to be implemented!!!!!)

exports.deletePlayer = catchAsync(async (req, res, next) => {
  
  //const doc = await Player.findByIdAndDelete(req.params.id);
  const realm = await dbconnect.getDBPointer()
  const doc = await realm.objectForPrimaryKey(Player.name,rlm.BSON.ObjectID(req.params.id))

  if (!doc) {
    return next(new AppError("No Player found with that ID", 404));
  }

  //await LinkedTag.findOneAndDelete({ Player: req.params.id });
   
  const docJson = doc.toJSON()
  if(docJson.image)
    deleteImage(docJson.image)
  realm.write(()=>{
      const links = [LinkedTagToPlayer]
        // , LinkedTeamToPlayer]
      let linkedDocs={}
      for (const link of links){
        console.log(link)
        linkedDocs = realm.objects(link.name).filtered("player._id==$0", rlm.BSON.ObjectID(req.params.id))
        if(linkedDocs.length > 0)
          realm.delete(linkedDocs[0])
      } 
      realm.delete(doc)
  })
  res.status(204).json({
    status: "success",
    data: null,
  });
});


exports.getAllWithLinked = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  const realm = await dbconnect.getDBPointer()
  const docr = await realm.objects(Player.name)


  const doc = docr.map((obj)=>{
      const player = {}
      //const player = obj.toJSON()
      console.log(player)
      player._id = obj._id.toString()
      player.playerId = obj.playerId
      player.description = obj.description
      player.playerType = obj.playerType
      player.image = obj.image
      player.name = obj.name
      if("linked" in obj &&  obj["linked"].length>0)
      {
        player["tag"] = {}
        player.tag.tag = obj.linked[0].tag._id.toString()
        player.tag.player = obj._id.toString()
        player.tag._id = obj.linked[0]._id.toString()
        player["taginfo"] = {tagId : obj.linked[0].tag.tagId}
      }

      




  return player

  })
  console.log(doc)
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});

const deleteImage = (fileName)=>{
  unlink(`client/build/uploads/playerImage/${fileName}`, err=>{
    if (err) throw err;
    console.log(`Successfully deleted ${fileName}`)}
    )
}
