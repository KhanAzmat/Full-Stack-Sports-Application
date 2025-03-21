
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const apiSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Name of project that will access api"],
    },

   
    key: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
  createdAt : {
    type:Date,
    default: Date.now(),
    required : true

  },
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


apiSchema.pre("save", function (next) {
  this.createdAt = Date.now() - 1000;
  next();
});

apiSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});



/*apiSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // false means password not changed
  return false;
};*/

/*userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};*/

module.exports = ApiKey = mongoose.model("ApiKey", apiSchema);