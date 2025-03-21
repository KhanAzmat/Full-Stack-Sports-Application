
//const mongoose = require("mongoose");
const realm = require("realm")
const Geofence =
  {

   
    name:"geofence",
    properties:{
      
    _id:{type:"objectId"},  

    floor: { type: "string"},

    name: { type: "string", required: true },

    location: {
      type: "string?"
      /*coordinates: {
        type: [[[Number]]],
        required: true,
      },*/
    },
    
    warningZone : { type: "double"},
    
    dangerZone  : { type: "double"},
    
    color: {
      type: "string",
      enum: ["0000FF", "00FF00", "FF0000"],
      default: "0000FF",
    },

    floorplan: {
      type: "floorplan",
      //ref: "Floorplan",
    },

    secondId: { type: "int"},
    
    description: "string?",
    geofenceType : "string",
    active: {
      type: "bool",
      default: true,
      select: false,
    },
  },
  primaryKey:"_id",
  
  };

/*geoFenceSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

geoFenceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "floorplan",
  });

  next();
});*/

module.exports = Geofence //= mongoose.model("GeoFence", geoFenceSchema);
