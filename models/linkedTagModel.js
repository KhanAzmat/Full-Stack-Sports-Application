


///const mongoose = require("mongoose");

const linkedTagSchema = {
  name:"linkedtag",
  properties:
  {
    _id:"objectId",

    tag: {
      type: "tag",
         },
    
   
    asset: { type: "asset"},
    
    active: {
      type: "bool",
      default: true,
      select: false,
    },
  },
  primaryKey:"_id",  

}

/*linkedTagSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

linkedTagSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tag",
    select: "tagId",
  })
    .populate({
      path: "asset",
      select: "name assetType image",
    })
  next();
});
*/
module.exports = linkedTagSchema //= mongoose.model("LinkedTag", linkedTagSchema);
