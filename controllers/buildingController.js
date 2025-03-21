const Building = require("../models/buildingModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createBuilding = catchAsync(async (req, res, next) => {
  const doc = await Building.findOne({ buildingId: req.body.buildingId });

  if (doc) {
    res.status(400).json("This Building already exists");
  } else {
    const data = await Building.create(req.body);

    res.status(204).json({
      status: "success",
      data: data,
    });
  }


});

exports.getAllBuildings = factory.getAll(Building);
exports.getBuilding = factory.getOne(Building);
exports.updateBuilding = factory.updateOne(Building);
exports.deleteBuilding = factory.deleteOne(Building);

exports.buildingCount = catchAsync(async (req, res, next) => {
  const docs = await Building.countDocuments({});

  res.status(200).json({
    status: "success",
    data: docs,
  });
});
