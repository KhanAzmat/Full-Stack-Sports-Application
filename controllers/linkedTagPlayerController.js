const LinkedTag = require("../models/linkedTagModel");
const LinkedTagPlayer = require('../models/linkedTagPlayer')
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const dbconnect = require("../models/dbconnect")
const Player = require("../models/playerModel")
const Tag = require("../models/tagModel")
const rlm = require("realm")
const pool = require('../models/sqlDbConnect')


exports.getAllLinkedTagPlayers = factory.getAll(LinkedTagPlayer.name);
exports.getLinkedTagPlayer = factory.getOne(LinkedTagPlayer.name);
exports.updateLinkedTagPlayer = factory.updateOne(LinkedTagPlayer.name);
exports.deleteLinkedTagPlayer = factory.deleteOne(LinkedTagPlayer.name);
// exports.getLinkedTagPlayerByTag = factory.getLinkedTagPlayerByTagId(LinkedTagPlayer.name)

exports.createLinkedTagPlayer = catchAsync(async (req, res, next) => {
  // const { tag, item, asset, employee } = req.body;
  console.log(req.body)
  const realm = await dbconnect.getDBPointer()
  try {
    let linkedPlayer    
    const linkedTagPlayer = await realm.objects(LinkedTagPlayer.name).filtered ("tag._id == $0",rlm.BSON.ObjectID(req.body.tag))
    
    if (req.body.player !== null) {
      //linkedAsset = await LinkedTag.findOne({ asset: req.body.asset });
      linkedPlayer = await realm.objects(LinkedTagPlayer.name).filtered("player._id == $0", rlm.BSON.ObjectID(req.body.player)) 
    }

    if (
      linkedTagPlayer.length > 0 ||
      linkedPlayer.length > 0
    ) {
      return res
        .status(400)
        .json(`Sorry! This Tag is already linked`);
    } else {

      const tagRef = await realm.objectForPrimaryKey(Tag.name,rlm.BSON.ObjectID(req.body.tag))
      console.log(tagRef)
      const playerRef = await realm.objectForPrimaryKey(Player.name,rlm.BSON.ObjectID(req.body.player)) 
    console.log(playerRef)
      if(!tagRef || !playerRef)
      {
        return res
        .status(400)
        .json("Player or Tag referece not found")
      } 
      
      const newLinkedTag = {
        tag: tagRef,
        player: playerRef
       
      };
      
      let result
      await realm.write(()=>{
        
           newLinkedTag._id = rlm.BSON.ObjectId()
           result = realm.create(LinkedTagPlayer.name, newLinkedTag)

      })

      // console.log('Result : ')
      // console.log(JSON.stringify(result))
      //let result = await newLinkedTag.save();
      const rslt = {}
      rslt.tag = result.tag._id.toString()
      rslt.player = result.player._id.toString()
      rslt._id = result._id.toString() 
      
      
      res.json(rslt);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

exports.savePlaybackData = catchAsync(async(req,res,next)=>{
  // console.log(req.body);
  const qry1 = 'INSERT INTO playback_data (`lapid`, `player`,`initials`,`x`,`y`,`z`,`jumpCount`,`stepCount`,`speed`,`ts`) VALUES ?';
  const qry2 = 'INSERT INTO laps (`lapid`,`start_time`,`stop_time`) VALUES (?)'
  const qry3 = 'INSERT INTO players (`lapid`, `player`) VALUES ?';
  const values1 = req.body;
  let playerArr = []
  req.body.forEach(el => {
    if(playerArr.findIndex((lap) => lap[1] === el[1]) === -1){
      playerArr.push([el[0],el[1]])
    }
  });

  // console.log('Player array', playerArr)
  const values2 = [req.body[0][0],req.body[0][9], req.body[req.body.length-1][9]]
  await pool.query(qry2, [values2], (err,data)=>{
    if(err) res.json(err)
  })

  await pool.query(qry3, [playerArr], (err,data)=>{
    if(err) res.json(err)
  })

  // console.log('Lap Data', laps)
  // console.log('Players', players)

  const [rows] = await pool.query(qry1, [values1], (err, data)=>{
    if(err) res.json(err);
    console.log(data)
    res.status(200).json({status:'Lap Created/Data Inserted'});
  })
  
})

exports.getAllLaps = catchAsync(async(req,res,next)=>{
  const qry = 'SELECT * FROM laps'
  await pool.query('SELECT * FROM laps')
  .then(([rows])=>{
    console.log(rows)
    res.json({data:rows})
  })
  .catch(err=>{
    res.json(err)
  })
})


exports.getPlaybackData = catchAsync(async(req,res,next)=>{
  console.log('Get Playback Data : ', req.params.id)
  const qry = 'SELECT * FROM laps WHERE id = ?'
  await pool.query(qry, req.params.id)
  .then(async ([rows])=>{
    console.log(rows[0].start_time, rows[0].stop_time)
    const values = [rows[0].start_time, rows[0].stop_time]
    const qry2 = 'SELECT * FROM playback_data WHERE ts BETWEEN ? AND ?'
    await pool.query(qry2, values)
    .then(([rows])=>{res.json({data:rows})})
    .catch(err=>res.json(err))
  })
  .catch(err=>{
    res.json(err)
  })
})

exports.getPlayersByDate = catchAsync(async (req,res,next)=>{
  console.log('Players by date :', req.query)
  const qry = 'SELECT * FROM players WHERE lapid IN (SELECT lapid FROM laps where start_time >= ? AND stop_time <= ?)'
  const values = [req.query.start,req.query.end]
  await pool.query(qry, values)
  .then(([rows])=>{
    console.log(rows)
    res.json({data:rows})})
  .catch(err=>res.json(err))
})

exports.getLapsByCriteria = catchAsync(async(req,res,next)=>{
  console.log('Laps by criteria',req.query)
  // const qry = 'SELECT * FROM laps WHERE lapid IN (SELECT DISTINCT lapid FROM playback_data WHERE player IN (?) AND ts BETWEEN ? AND ? )'
  const qry = 'SELECT * FROM laps WHERE lapid IN (SELECT DISTINCT lapid FROM playback_data WHERE ts BETWEEN ? AND ? )'
  // const values = [req.query.players, req.query.startDate, req.query.endDate]
  const values = [req.query.startDate, req.query.endDate]
  await pool.query(qry, values)
  .then(([rows])=>{
    console.log(rows)
    res.json({data:rows})})
  .catch(err=>res.json(err))

})



