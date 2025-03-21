const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };
const tagSchema = {
  name:"tag",
  properties:
  {
    _id: "objectId",
    tagId: { type: "string",  uppercase: true },
    tagRegDate: { type: "date", default: Date() },
    height : {type:"float", default:1.4},
    active: {
      type: "bool",
      default: true,
      select: false,
    },
    // linked: {
    //   type: 'linkingObjects',
    //   objectType: 'linkedTagToPlayer',
    //   property: 'tag'
    // }


  },
  primaryKey:"_id", 
}
/*
tagSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

tagSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});
*/
module.exports = tagSchema//Tag = mongoose.model("Tag", tagSchema);
