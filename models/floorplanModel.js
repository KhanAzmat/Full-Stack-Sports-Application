
//const mongoose = require("mongoose");
const realm = require("realm")
//const opts = { toJSON: { virtuals: true } };

const FloorplanSchema = {
  
    // user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    /*building: {
      type: mongoose.Schema.ObjectId,
      ref: "Building",
      required: true,
    },*/
    name:"floorplan",
    properties :{
    _id:{type:"objectId"},  
    floorplan:{type :  "string"},
    floor: {type : "string"},
    description: "string?",
    x : "double?",
    y:"double?",
    z:"double?",
    scale : "double?",
    angle:"double?",
    opacity : "double?",
    camera : "double?",
    configured : {type:"bool",
                 default:false, 
                 required:false} ,
    



    /*floorPlanProperty["scale"] = cube.scale.x
    floorPlanProperty["angle"] = cube.rotation
    floorPlanProperty["px"] = floorPlan.position.x
    floorPlanProperty["py"] = floorPlan.position.y
    floorPlanProperty["pz"] = floorPlan.position.z
    floorPlanProperty["opacity"]=cube.material.opacity*/



    active: {
      type: "bool",
      default: true,
      select: true,
    },
  },
 /* opts,
  {
    timestamps: true,
  }*/
  primaryKey:"_id",
  };

/*floorplanSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

floorplanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "anchors",
  });

  next();
}
};*/
module.exports = FloorplanSchema //= mongoose.model("Floorplan", floorplanSchema);
