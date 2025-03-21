const express = require("express");
const authController = require("./../controllers/authController");
const gltfController = require("./../controllers/gltfController");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const Gltf = require("../models/gltfModel");
const FloorPlan = require("../models/floorplanModel")
const { nextTick } = require("process");
const rlm = require("realm")
const dbconnect = require("./../models/dbconnect")
const router = express.Router();


//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only


router.route("/").get(authController.restrictTo("admin", "user"), gltfController.getAllGltfs);

router.use(authController.restrictTo("admin"));

// ADD  FLOOR  PLAN
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() +"/client/build/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["application/octet-stream"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.route("/").post(upload.single("gltf"), async (req, res) => {
  const gltf = req.file.filename;
  //const floorplan = req.body.floorplan;
  const description = req.body.description;
  const ambiIntensity =Number( req.body.ambiIntensity);
  const dirIntensity = Number(req.body.dirIntensity)
  const scale = Number(req.body.scale)
  const angle =  Number(req.body.angle)
  const x = Number(req.body.x)
  const y =Number( req.body.y)
  const z =Number( req.body.z)



  const realm = await dbconnect.getDBPointer()
  const floorId = rlm.BSON.ObjectID(req.body.floorplan)
  let floor = realm.objectForPrimaryKey(FloorPlan.name,floorId )
  
  if(!floor)
  {
    res.status(404).send("Cant find floorId");
    return
  }

  const floorplan = floor;
  const newGltfData = {
    gltf,
    floorplan,
    description,
    ambiIntensity,
    dirIntensity,
    scale,
    angle,
    x,
    y,
    z,
  };

  try {
    //let newGltf = Gltf.create(newGltfData);
    
    newGltfData._id = rlm.BSON.ObjectId()
    await realm.write(()=>{
        realm.create(Gltf.name, newGltfData)
    })



    res.status(200).json(newGltfData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
// END ADD FLOOR PLAN

router
  .route("/:id")
  .get(gltfController.getGltf)
  .patch(gltfController.updateGltf)
  .delete(gltfController.deleteGltf);
router.route("/floorplan/:id").get(authController.restrictTo("admin", "user"),gltfController.getGltfByFloor)


router.route("/updategltf/:id").patch(upload.single("gltf"),(req, res,next)=>{

  req.body["gltf"]=req.file.filename
  next()


},gltfController.updateGltf)

module.exports = router;
