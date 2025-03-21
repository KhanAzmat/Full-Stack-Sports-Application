const Employee = require("../models/employeeModel");
const factory = require("./handlerFactory");
const LinkedTag = require("../models/linkedTagModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const multer = require("multer");



exports.createEmployee = catchAsync(async (req, res, next) => {
  const doc = await Employee.findOne({ employeeId: req.body.employeeId });

  if (doc) {
    res.status(400).json("This Employee already exists");
  } else {
  console.log("Employee data",req.body)
  
  const employeeId =req.body.employeeId
  const name = req.body.name
  const contactNo=req.body.contactNo
  const email = req.body.email
  const skills = req.body.skills
  const designation = req.body.designation
  const dateOfBirth =req.body.dateOfBirth
  const dateOfJoining=req.body.dateOfJoining
  const image = req.file.filename
  


  const employeeData ={ employeeId,
    name,
    contactNo,
    email,
    skills,
    designation,
    dateOfBirth,
    dateOfJoining,
  image}
    const data = await Employee.create(employeeData);

    res.status(204).json({
      status: "success",
      data: data,
    });
  }

});

exports.getAllEmployees = factory.getAll(Employee);
exports.getEmployee = factory.getOne(Employee);
exports.updateEmployee = factory.updateOne(Employee);

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const doc = await Employee.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No Employee found with that ID", 404));
  }
 await LinkedTag.findOneAndDelete({ employee: req.params.id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
