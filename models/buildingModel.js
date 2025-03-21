const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };

const buildingSchema = new mongoose.Schema(
  {
    buildingId: { type: String, required: true },
    buildingName: { type: String, required: true },
    basements: Number,
    floors: Number,
    description: String,
   
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  opts,
  {
    timestamps: true,
  }
);

buildingSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

module.exports = Building = mongoose.model("Building", buildingSchema);
