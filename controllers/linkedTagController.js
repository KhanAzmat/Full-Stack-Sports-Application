const LinkedTag = require("../models/linkedTagModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const dbconnect = require("../models/dbconnect")
const Asset = require("../models/assetModel")
const Tag = require("../models/tagModel")
const rlm = require("realm")

exports.getAllLinkedTags = factory.getAll(LinkedTag.name);
exports.getLinkedTag = factory.getOne(LinkedTag.name);
exports.updateLinkedTag = factory.updateOne(LinkedTag.name);
exports.deleteLinkedTag = factory.deleteOne(LinkedTag.name);
exports.getLinkedTagByTag = factory.getLinkedTagByTagId(LinkedTag.name)

exports.createLinkedTag = catchAsync(async (req, res, next) => {
  // const { tag, item, asset, employee } = req.body;
  console.log(req.body)
  const realm = await dbconnect.getDBPointer()
  try {
    //const linkedTag = await LinkedTag.findOne({ tag: req.body.tag });
    //let linkedItem , linkedAsset , linkedEmployee;
    let linkedAsset    
    const linkedTag = await realm.objects(LinkedTag.name).filtered ("tag._id == $0",rlm.BSON.ObjectID(req.body.tag))
    
    if (req.body.asset !== null) {
      //linkedAsset = await LinkedTag.findOne({ asset: req.body.asset });
      linkedAsset = await realm.objects(LinkedTag.name).filtered("asset._id == $0", rlm.BSON.ObjectID(req.body.asset)) 
    }
   



    if (
      linkedTag.length > 0 ||
      linkedAsset.length > 0
    ) {
      return res
        .status(400)
        .json(`Sorry! This Tag/${req.body.elementType} is already linked`);
    } else {

      const tagRef = await realm.objectForPrimaryKey(Tag.name,rlm.BSON.ObjectID(req.body.tag))
      console.log(tagRef)
      const assetRef = await realm.objectForPrimaryKey(Asset.name,rlm.BSON.ObjectID(req.body.asset)) 
    console.log(assetRef)
      if(!tagRef || !assetRef)
      {
        return res
        .status(400)
        .json("Asset or Tag referece not found")
      } 
      
      const newLinkedTag = {
        tag: tagRef,
        asset: assetRef
       
      };
      
      let result
      await realm.write(()=>{
        
           newLinkedTag._id = rlm.BSON.ObjectId()
           result = realm.create(LinkedTag.name, newLinkedTag)

      })


      console.log(result)
      //let result = await newLinkedTag.save();
      const rslt = {}
      rslt.tag = result.tag._id.toString()
      rslt.asset = result.asset._id.toString()
      rslt._id = result._id.toString() 
      
      
      res.json(rslt);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});




