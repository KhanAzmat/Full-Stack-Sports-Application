
const realm = require("realm")
const mongoose = require("mongoose");
const { primaryKey } = require("./userModel");
//const opts = { toJSON: { virtuals: true } };

const Anchors ={
  
  
    name : "anchors",
    properties:
     {
  _id:"objectId",    
  hostname: { type: "string", default:"localhost"},
    floorplan: {
      type:"floorplan"
    },
   configuration : {type : "string" , default : ""},
   port: {type:"int", default:9000},
   //anchorIP :{type:[String],default : []},


    date: { type: "date", default: Date() },
    active: {
      type: "bool",
      default: true,
      //select: false,
    },
  },
  primaryKey:"_id",  
};

/*AnchorsSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

AnchorsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "floorplan",
  });

  next();
});


/*floorplanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "building",
  });

  next();
});*/

module.exports = Anchors //= mongoose.model("Anchors", AnchorsSchema);
