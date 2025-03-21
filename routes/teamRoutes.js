const express = require('express')
const Team = require('../models/teamModel')
const authController = require('../controllers/authController')
const teamController = require('../controllers/teamController')
const dbconnect = require("./../models/dbconnect")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const rlm = require("realm")
const router = express.Router()

router.use(authController.protect)

router.route('/').get(teamController.getAllTeams)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "client/build/uploads/teamImage");
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  let upload = multer({ storage, fileFilter });

router.route('/').post(upload.single('image'),async(req,res)=>{
    
    const realm = await dbconnect.getDBPointer();
  const doc = realm.objects(Team.name).filtered("name == $0", req.body.name)

  if (doc.length > 0) {
    res.status(400).json(`The Team already exists`);
  } else {
    console.log(req.body.players)
    const image = req.file?req.file.filename:undefined;
    const name = req.body.name;
    const location = req.body.location;
    const color = req.body.color;
    const sports = req.body.sports;
    const players = ['test1', 'test2']

    const newTeamData = {
      name,
      image,
      location,
      color,
      sports,
      players,
      _id : rlm.BSON.ObjectId()
    };
    let data
    try{
        await realm.write(()=>{
            data = realm.create(Team.name,newTeamData);
           })
    }catch(err){
        res.status(500).json({
            status : 'error',
            message : err
        })
    }
    

  console.log(data.toJSON())
    res.status(200).json({
      status: "success",
      data: data
    });
  }

})






router.route('/:id')
    .patch(upload.single('image'),teamController.updateTeam)
    .delete(teamController.deleteTeam)


// router.route('/players/:id')
//   .post(teamController.addPlayers)
module.exports = router