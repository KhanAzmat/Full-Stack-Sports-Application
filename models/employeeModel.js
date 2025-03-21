const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, uppercase: true},
    name: { type: String, required: true },
    contactNo: Number,
    address: String,
    email: {
      type: String,
      lowercase: true,
    },
    skills: [String],
    designation: String,
    dateOfBirth: Date,
    dateOfJoining: Date,
    image: String,
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

employeeSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});


module.exports = Employee = mongoose.model("Employee", employeeSchema);
