const Floorplan = require("../models/floorplanModel");
const GeoFence = require("../models/geoFenceModel");
const Gltf = require("../models/gltfModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const dbconnect = require("./../models/dbconnect")
const rlm = require("realm")



//exports.getFloorByBuilding = factory.getFloorByBuilding(Floorplan)
exports.getAllFloorplans = factory.getAll(Floorplan.name);
exports.getFloorplan = factory.getOne(Floorplan.name);
exports.updateFloorplan = factory.updateOne(Floorplan.name);

exports.deleteFloorplan = catchAsync(async (req, res, next) => {

  const realm = await dbconnect.getDBPointer()
  const floorId = rlm.BSON.ObjectID(req.params.id)
  const  doc =  realm.objectForPrimaryKey(Floorplan.name,floorId )
      
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    } 

    await realm.write(()=>{

       
       const geofences = realm.objects(GeoFence.name).filtered("floorplan._id == $0",floorId )
       realm.delete(geofences) 

       const gltf= realm.objects(Gltf.name).filtered("floorplan._id == $0",floorId )
       realm.delete(gltf) 

       realm.delete(doc)



    })
   
   

//await Floorplan.findByIdAndDelete(req.params.id);

 // await GeoFence.deleteMany({ floorplan: req.params.id });
  //await Gltf.findOneAndDelete({ floorplan: req.params.id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
