const express = require("express");
const JIMP = require('jimp')
const authController = require("./../controllers/authController");
const playerController = require('./../controllers/playerController')
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

//Protect all routes after this middleware
router.use(authController.protect);

// router.route("/").get(playerController.getAllWithLinked);

router.route('/').get(playerController.getAllPlayers)

function createIcon(req,res,next){
  if(req.file)
  {
  console.log('Image')
  console.log(req.file)
  const file = req.file.filename
  const filename = extension = file.substring(0,file.lastIndexOf('.'))
  const path = "client/build/uploads/playerImage/" + file
  console.log(path)
  JIMP.read(path)
  .then(img => {
    return img
      .resize(70, 70) // resize
      .quality(10) 
      .circle()
      .write("client/build/uploads/stamp/" + filename +".png"); // save
  })
  .catch(err => {
    console.error(err);
  });
}
  next()

}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/build/uploads/playerImage");
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






router.route("/").post(upload.single("player"),createIcon, playerController.createPlayer);

router
  .route("/:id")
  .get(playerController.getPlayer)
  .patch(upload.single("player"), createIcon, playerController.updatePlayer)
  .delete(playerController.deletePlayer);


module.exports = router;
