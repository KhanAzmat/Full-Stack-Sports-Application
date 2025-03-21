const Tag = require("../models/tagModel");
const LinkedTag = require("../models/linkedTagModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const dbconnect = require("../models/dbconnect")
const rlm = require("realm")

exports.createTag = catchAsync(async (req, res, next) => {
  //const doc = await Tag.findOne({ tagId: req.body.tagId });
  
  const realm = await dbconnect.getDBPointer()
  req.body.tagId = req.body.tagId.toUpperCase()
  const doc = realm.objects(Tag.name).filtered("tagId == $0", req.body.tagId)
  console.log(req.body)

  if (doc.length > 0) {
    res.status(400).json("This Tag already exists");
  } else {

    //const data = await Tag.create(req.body);
  console.log(req.body)
   let d = {tagId : req.body.tagId.toUpperCase()}
    let data
    await realm.write(()=>{

          d._id= rlm.BSON.ObjectId()
         data = realm.create(Tag.name, d)
    })

    res.status(204).json({
      status: "success",
      data: data,
    });
  }

});

////serchtag by tag  id

exports.getTagByID= catchAsync(async(req,res,next)=>{


  const realm = await dbconnect.getDBPointer()
  //req.body.tagId = req.body.tagId.toUpperCase()
  const tagId = req.params.id.toUpperCase()
  const doc = realm.objects(Tag.name).filtered("tagId == $0",tagId)
  console.log(req.body)

  if (doc.length > 0) {
    const newdoc= doc[0]
    const newd = {_id:newdoc._id, tagId:newdoc.tagId,tagRegDate : newdoc.tagRegDate, height: newdoc.height}
    res.status(200).json({status:"success", data: newd});
  } else {
      res.status(400).json({status:"Bad request"})
  }

})






/// bulk entry of tags

exports.createTags = catchAsync(async (req, res, next) => {
  //const doc = await Tag.findOne({ tagId: req.body.tagId });
  if(! "tagList" in req.body)
  {
    res.status(400).json("Bad request")
    next()
  }  
  const realm = await dbconnect.getDBPointer()
  //req.body.tagId = req.body.tagId.toUpperCase()
  const doc = realm.objects(Tag.name).filtered("tagId IN $0", req.body.tagList)
  console.log(req.body)

  if (doc.length > 0) {
    res.status(400).json("Some Tag already exists");
  } else {

    //const data = await Tag.create(req.body);
  console.log(req.body)
   //let d = {tagId : req.body.tagId.toUpperCase()}
    let data
    await realm.write(()=>{
         req.body.tagList.forEach((obj)=>{
          //d._id= rlm.BSON.ObjectId()
         //data = realm.create(Tag.name, d)
           const d = {tagId: obj.toUpperCase(),
                        _id: rlm.BSON.ObjectId()  
                      }

            data=realm.create(Tag.name,d)          


         })
    })

    res.status(204).json({
      status: "success",
      data: data,
    });
  }

});





exports.getAllTags = factory.getAll(Tag.name);
exports.getTag = factory.getOne(Tag.name);
exports.updateTag = factory.updateOne(Tag.name);
exports.deleteTag =  catchAsync(async (req, res, next) => {
  
  
  //const doc = await Tag.findByIdAndDelete(req.params.id);
   const realm = await dbconnect.getDBPointer()

   const doc = realm.objectForPrimaryKey(Tag.name,rlm.BSON.ObjectID(req.params.id))
  if (!doc) {
    return next(new AppError("No Tag found with that ID", 404));
  }



   await realm.write(()=>{
    console.log('Inside delete',req.params.id)
      // const linkedTag = realm.objects(LinkedTag.name).filtered("tag._id == $0", rlm.BSON.ObjectID(req.params.id))
      const linkedTag = realm.objects(LinkedTag.name)
      console.log(linkedTag)
      if(linkedTag.length >0)
      {
          realm.delete(linkedTag[0])
      }

      realm.delete(doc)

   })


  //await LinkedTag.findOneAndDelete({tag: req.params.id});


  res.status(204).json({
    status: "success",
    data: null,
  });
});


exports.tagsCount = catchAsync(async (req, res, next) => {
  //to allow for nested getReviews on tour (small hack)
 // const docs = await Tag.countDocuments({});
  const realm = await dbconnect.getDBPointer()
  const docs = realm.objects(Tag.name).length

  res.status(200).json({
    status: "success",
    data: docs,
  });
});


exports.getAllWithLinked = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};

/*  const features = await Tag.aggregate(  [{
    $lookup: {
             from: "linkedtags", // collection name in db
             localField: "_id",
             foreignField: "tag",
             as: "asset"
             }
            },
     {$unwind:{ path: "$asset", preserveNullAndEmptyArrays: true }},
     { $project: {
       "tagId": 1, "tagRegDate": 1,"asset.tag":1,"asset.asset":1,"asset._id":1}
     }])
   
  // const doc = await features.query.explain();
  const doc =  features;
 console.log(features)
 */

  const realm = await dbconnect.getDBPointer()
  const docr  = await realm.objects(Tag.name)

  const doc = docr.map((obj)=>{
      const tag ={}
      //const tag = obj.toJSON()
      console.log(tag)
      tag._id = obj._id.toString()
      tag.tagId = obj.tagId
      tag.tagRegDate=obj.tagRegDate
      tag.height = obj.height
      if("linked" in obj && obj["linked"].length > 0)
      {
        tag["asset"] = {}
        tag.asset.tag = obj._id.toString()
        tag.asset.asset = obj.linked[0].asset._id.toString()
        tag.asset._id = obj.linked[0]._id.toString()
      } 
      return tag

  })


  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});


exports.getOneWithLinked = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  const  tagId =  req.params.id

/*  const features = await Tag.aggregate(  [
    {$match:{tagId:req.params.id}},
    {
    $lookup: {
             from: "linkedtags", // collection name in db
             localField: "_id",
             foreignField: "tag",
             as: "asset"
             }
            },
     {$unwind:{ path: "$asset", preserveNullAndEmptyArrays: true }},
    
     {$lookup: {
      from: "assets", // collection name in db
      localField: "asset.asset",
      foreignField: "_id",
      as: "assetinfo"
      },
    },
    {$unwind:{ path: "$assetinfo", preserveNullAndEmptyArrays: true }},
    { $project: {
      "tagId": 1,"assetinfo.name":1,"assetinfo.assetType":1,"assetinfo.assetId":1,"assetinfo.image":1 }
    }
    ])
   
  // const doc = await features.query.explain();
  const doc =  features;
 console.log(features)
 */ 
req.params.id = req.params.id.toUpperCase()
  const realm = await dbconnect.getDBPointer()
  const doc  = await realm.objects(Tag.name).filtered("tagId == $0",req.params.id)
 
  // SEND RESPONSE
  if(doc&& doc.length > 0)
  {
   const tag={}

   const data = doc[0].toJSON()
   tag._id = data._id.toString()
   tag.tagId = data.tagId
   tag.tagRegDate = data.tagRegDate
   tag.height = data.height
 
   if("linked" in data && data["linked"].length > 0)
   {
     tag["assetinfo"] ={}
     tag.assetinfo.name = data.linked[0].asset.name
     tag.assetinfo.assetType = data.linked[0].asset.assetType
     tag.assetinfo.assetId= data.linked[0].asset.assetId
     tag.assetinfo.image = data.linked[0].asset.image
   }
   
   

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: tag,
  });
}
else
{
  res.status(404).json("Tag Not found");

}
});


