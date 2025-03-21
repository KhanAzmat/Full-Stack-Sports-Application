
const express = require('express')
const serverController = require('../controllers/serverController')
const authController = require("./../controllers/authController");
const dbconnect = require('../models/dbconnect')
const multer = require('multer')
const { v4:uuidv4 } = require('uuid')
const path = require('path')
const Server = require('../models/serverModel')
const relm = require('realm')
const router = express.Router()

//Protect all routes after this middleware
router.use(authController.protect);

router.route("/").get(serverController.getAllServers);

// ADD  Server Image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/build/uploads/serverImage");
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

router.route("/").post(upload.single("server"), async (req, res) => {
  
  const realm = await dbconnect.getDBPointer();
  const doc = realm.objects(Server.name).filtered("name == $0", req.body.name)

  if (doc.length > 0) {
    res.status(400).json(`The Server for ${req.body.name} already exists`);
  } else {
    const name = req.body.name;
    const image = req.file.filename;
    const location = req.body.location;
    // const description = req.body.description;
  
    const newServerData = {
      name,
      image,
      location,
      _id : relm.BSON.ObjectId()
    }

    let data;
    await realm.write(()=>{
      data = realm.create(Server.name, newServerData)
    })

  console.log(data.toJSON())
    res.status(204).json({
      status: "success",
      data: data.toJSON(),
    });
  }


 
});
// End Add Server

router
  .route("/:id")
  .get(serverController.getServer)
  .patch(upload.single("server"), serverController.updateServer)
  .delete(serverController.deleteServer)


module.exports = router;
