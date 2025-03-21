const factory = require('./handlerFactory')
const LinkedTeamPlayer =  require('../models/linkedTeamPlayer')
const Team = require('../models/teamModel')
const Player = require('../models/playerModel')
const catchAsync = require("../utils/catchAsync");
const dbconnect = require("../models/dbconnect")
const rlm = require("realm")
const AppError = require('../utils/appError')

exports.getAllLinkedTeamPlayers = factory.getAll(LinkedTeamPlayer.name)
exports.deleteLinkedTeamPlayer = factory.deleteOne(LinkedTeamPlayer.name)

exports.createLinkedTeamPlayer = catchAsync(async(req,res,next)=>{
  console.log('Inside createLinkedTeamPlayerController: ')
  console.log(req.body.players)
    const realm = await dbconnect.getDBPointer()
    try{
        const playerIds = req.body.players
        let linkedPlayer=[] , availablePlayer = []
        const linkedTeamPlayer = await realm.objects(LinkedTeamPlayer.name).filtered('team._id == $0', rlm.BSON.ObjectID(req.body.team))
        let players  = await realm.objects(Player.name).toJSON()
        console.log(players)
        players.forEach(player => {
            strId = player._id.toJSON()
            if(playerIds.includes(strId)){
                console.log(true)
                if(player.team.length>0)
                    linkedPlayer.push(player)
                else
                    availablePlayer.push(player)
            }
                
        });
        if(linkedTeamPlayer.length > 0 || linkedPlayer.length>0){
            return res
              .status(400)
              .json(`Sorry! This team/player is already linked`);
          }
        else{
            const teamRef = await realm.objectForPrimaryKey(Team.name,rlm.BSON.ObjectID(req.body.team))
            console.log(availablePlayer[0]._id)
            availablePlayer = availablePlayer.map(player=>rlm.BSON.ObjectID(player._id))
            const playerRef = await realm.objects(Player.name).filtered('_id IN $0', availablePlayer)
            if(!teamRef || !playerRef)
      {
        return res
        .status(400)
        .json("Player or Team reference not found")
      } 

      const newLinkedTeam = {
        _id : rlm.BSON.ObjectID(),
        team: teamRef,
        players: playerRef
       
      }
      let result
      console.log(newLinkedTeam)
      await realm.write(()=>{
        result = realm.create(LinkedTeamPlayer.name, newLinkedTeam)

      })
    // console.log('Result : ')
    // console.log(result.toJSON())
    const rslt = {}
    rslt.team = result.team._id.toString()
    rslt.players = result.players.map(player=>({
        _id : player._id.toString(),
        name : player.name.toString(),
        initials : player.initials.toString()
    }))
    rslt._id = result._id.toString() 
      
      
      res.json(rslt);

        }
    }catch(err){
        console.error(err);
    res.status(500).send("Server Error");
    }
})


exports.updateLinkedTeamPlayer = catchAsync(async(req,res,next)=>{
    if(!req.params.id)
    {
      res.status(400).json({
        status: "Bad request missing id",
      })
      return
    }
    if(!req.body.players)
    {
      res.status(400).json({
        status: "Bad request missing players",
      })
      return
    }
    const realm = await dbconnect.getDBPointer()
    const  doc =  realm.objectForPrimaryKey(LinkedTeamPlayer.name, rlm.BSON.ObjectID(req.params.id))
    

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    } 
  
const docJson = doc.toJSON()
const playerIds = req.body.players
  let linkedPlayer=[] , availablePlayer = []
  let players  = await realm.objects(Player.name).toJSON()
      players.forEach(player => {
          strId = player._id.toJSON()
          if(playerIds.includes(strId)){
            // Check if the players are  :
            //  - included in the same linkedTeamPlayer object(the entire players array can then be replaced with the updated one)
            //  - incuded in other linkedTeamPlayer object(the player is not available to be relinked)
            //  - not incuded in team(player can be added to theteam)
              if(player.team.length>0){
                if(player.team[0].team._id.toString() !== docJson.team._id.toString())
                  linkedPlayer.push(player)
                else
                  availablePlayer.push(player)
              } 
              else
                  availablePlayer.push(player)
          }   
      });
      if(linkedPlayer.length>0){
          return res
            .status(400)
            .json(`Sorry! This player is already in a team.`);
        }
        availablePlayer = availablePlayer.map(player=>rlm.BSON.ObjectID(player._id))
        availablePlayer = await realm.objects(Player.name).filtered('_id IN $0', availablePlayer)
    
    await realm.write(()=>{
        doc.players= availablePlayer

      console.log(doc.toJSON())

        let newdoc = doc.toJSON()
        newdoc.players = newdoc.players.map(player=>
          ({_id : player._id,
            name :  player.name,
            initials : player.initials,
            image : player.image,
        color : player.color,
    }))

    // console.log(newdoc)
      res.status(200).json({
        status: "success",
        data: {
          data: newdoc,
        },
      })
    })
})

exports.removeAllPlayers = catchAsync(async(req,res,next)=>{
    if(!req.params.id)
    {
      res.status(400).json({
        status: "Bad request missing id",
      })
      return
    }
   
    const realm = await dbconnect.getDBPointer()
    const  doc =  realm.objectForPrimaryKey(LinkedTeamPlayer.name, rlm.BSON.ObjectID(req.params.id))
    // const doc = realm.objects(LinkedTeamPlayer.name).filtered('team._id == $0', rlm.BSON.ObjectID(req.params.id))
    
    console.log(req.params.id)
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    } 

    await realm.write(()=>{
        doc.players.clear()
      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      })
    })
})