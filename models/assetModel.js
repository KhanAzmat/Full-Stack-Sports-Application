
const mongoose = require("mongoose");
const { primaryKey } = require("./tagModel");

const assetSchema = {
  name:"asset",
  properties:
  {
    _id : "objectId",
    assetId: { type: "string"},
    name: { type: "string"},
    /*type: String,
    shape: String,
    width: Number,
    height: Number,
    length: Number,
    breadth: Number,
    radius: Number,
    circumference: Number,
    color: String,
    weight: Number,
    maxTemp: String,
    minTemp: String*/
    assetType: {
      type: "string",
      enum: ["Employee","Machine Tool","Other object"],
      default: "Employee",
      required: true,
    },
    image: "string?",
    description: "string?",
    active: {
      type: "bool",
      default: true,
      select: false,
    },
    
    linked: {
      type: 'linkingObjects',
      objectType: 'linkedtag',
      property: 'asset'
    }
   

  },
  primaryKey:"_id",
}


/*assetSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

assetSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});
*/
module.exports = assetSchema//mongoose.model("Asset", assetSchema);
