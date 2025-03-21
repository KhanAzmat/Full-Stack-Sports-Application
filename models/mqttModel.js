
const realm = require("realm")
const mongoose = require("mongoose");
const { primaryKey } = require("./userModel");
//const opts = { toJSON: { virtuals: true } };

const MQTT ={
  
  
    name : "mqtt",
    properties:
     {
  _id:"objectId",    
  hostname: { type: "string", default:"localhost"},
    
   
   port: {type:"int", default:1883},
   //anchorIP :{type:[String],default : []},

    username:"string?",
    password:"string?",
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

module.exports = MQTT //= mongoose.model("Anchors", AnchorsSchema);
