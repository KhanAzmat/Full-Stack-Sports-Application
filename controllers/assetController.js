

const Asset = require("../models/assetModel");
const LinkedTag = require("../models/linkedTagModel")
const factory = require("./handlerFactory");
//const LinkedTag = require("../models/linkedTagModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const rlm = require("realm")
const dbconnect = require("../models/dbconnect")

exports.createAsset = catchAsync(async (req, res, next) => {

   const realm = await dbconnect.getDBPointer()

  //const doc = await Asset.findOne({assetId: req.body.assetId});
  const doc = await realm.objects(Asset.name).filtered("assetId == $0", req.body.assetId)

console.log(req.body)

    if (doc.length > 0) {
     res.status(400).json("This asset already exists");
  } else {

   const assetId = req.body.assetId
   const name = req.body.name
   const assetType = req.body.assetType
   const image = req.file?req.file.filename:null
   const description = req.body.description

   const assetData = {
     assetId,
     name,
     assetType,
     image,
     description
   }


    //const data =  await Asset.create(assetData);
   let data
    await realm.write(()=>{
     assetData._id = rlm.BSON.ObjectId()
     data = realm.create(Asset.name, assetData)

   })
 
    res.status(204).json({
      status: "success",
      data: data,
    });
  }


});

exports.getAllAssets = factory.getAll(Asset);
exports.getAsset = factory.getOne(Asset);
exports.updateAsset = factory.updateOne(Asset);


////Need to delete image when deleting record (Yet to be implemented!!!!!)

exports.deleteAsset = catchAsync(async (req, res, next) => {
  
  //const doc = await Asset.findByIdAndDelete(req.params.id);
  const realm = await dbconnect.getDBPointer()
  const doc = await realm.objectForPrimaryKey(Asset.name,rlm.BSON.ObjectID(req.params.id))

  if (!doc) {
    return next(new AppError("No Asset found with that ID", 404));
  }

  //await LinkedTag.findOneAndDelete({ asset: req.params.id });
   
  realm.write(()=>{
      const linked = realm.objects(LinkedTag.name).filtered("asset._id==$0", rlm.BSON.ObjectID(req.params.id))
      if(linked.length > 0)
      {
        realm.delete(linked[0])
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
  const docr = await realm.objects(Asset.name)

/*  const features = await Asset.aggregate(
                                                 [{
                                                 $lookup: {
                                                          from: "linkedtags", // collection name in db
                                                          localField: "_id",
                                                          foreignField: "asset",
                                                          as: "tag"
                                                          }
                                                         },
                                                  {$unwind:{ path: "$tag", preserveNullAndEmptyArrays: true }},
                                                  { $lookup : {
                                                           from:"tags",
                                                           localField : "tag.tag",
                                                           foreignField : "_id",
                                                           as : "taginfo"
                                                  }},
                                                  {$unwind:{ path: "$taginfo", preserveNullAndEmptyArrays: true }},
                                                  { $project: {
                                                    "assetId": 1,"description": 1, "assetType": 1,"image": 1, "name": 1,"tag.tag":1,"tag.asset":1,"tag._id":1,"taginfo.tagId":1}
                                                  }]
                                                   )
*/    
  // const doc = await features.query.explain();


  const doc = docr.map((obj)=>{
      const asset = {}
      //const asset = obj.toJSON()
      console.log(asset)
      asset._id = obj._id.toString()
      asset.assetId = obj.assetId
      asset.description = obj.description
      asset.assetType = obj.assetType
      asset.image = obj.image
      asset.name = obj.name
      if("linked" in obj &&  obj["linked"].length>0)
      {
        asset["tag"] = {}
        asset.tag.tag = obj.linked[0].tag._id.toString()
        asset.tag.asset = obj._id.toString()
        asset.tag._id = obj.linked[0]._id.toString()
        asset["taginfo"] = {tagId : obj.linked[0].tag.tagId}
      }

      




  return asset

  })
  console.log(doc)
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});

