const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };

const organisationSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },

    name: { type: String, required: true, unique: true },
    email: String,
    country: String,
    city: String,
    address: String,
    phone: Number,
    licensee: String,
    validity: Date,
    anchors: Number,
    tags: Number,
    locationEngineId: String,
    features: String,
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

organisationSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

module.exports = Organisation = mongoose.model(
  "Organisation",
  organisationSchema
);
