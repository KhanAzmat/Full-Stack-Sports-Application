const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, uppercase: true},
    name: { type: String, required: true,},
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
    minTemp: String,
    description: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});

module.exports = Item = mongoose.model("Item", itemSchema);
