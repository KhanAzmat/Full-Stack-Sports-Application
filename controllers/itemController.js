const Item = require("../models/itemModel");
const factory = require("./handlerFactory");
const LinkedTag = require("../models/linkedTagModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createItem = catchAsync(async (req, res, next) => {
  const doc = await Item.findOne({ itemId: req.body.itemId });

  if (doc) {
    res.status(400).json("This Item already exists");
  } else {
    const data = await Item.create(req.body);

    res.status(204).json({
      status: "success",
      data: data,
    });
  }

 
});
exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = catchAsync(async (req, res, next) => {
  const doc = await Item.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No Item found with that ID", 404));
  }

 await LinkedTag.findOneAndDelete({ item: req.params.id });


  res.status(204).json({
    status: "success",
    data: null,
  });
});
