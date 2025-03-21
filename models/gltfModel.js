
const mongoose = require("mongoose");
//const opts = { toJSON: { virtuals: true } };
const realm = require("realm")
const Gltf ={
  
    name : "gltf",
    properties:    
    {
    _id:{type:"objectId"} , 
    gltf: { type:"string" },
    floorplan: {
      type: "floorplan"
      
    },
    description: "string?",
    ambiIntensity : "double",
    dirIntensity : "double",
    scale : "double",
    angle : "double",
    x:"double",
    y:"double",
    z:"double",


    date: {type: "date", default: Date()},
    active: {
      type: "bool",
      default: true,
      select: false,
    },
  },

  primaryKey:"_id",
  
};
/*gltfSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

gltfSchema.pre(/^find/, function (next) {
  this.populate({
    path: "floorplan",
  });

  next();
});
*/
module.exports = Gltf //= mongoose.model("Gltf", gltfSchema);
