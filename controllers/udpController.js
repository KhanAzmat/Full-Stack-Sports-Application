const UDP = require("../models/udpModel");
const factory = require("./handlerFactory");

exports.getUDP = factory.getAll(UDP.name);
//exports.getUDP = factory.getOne(UDP.name);
//exports.updateAnchors = factory.updateOne(Anchors.name);
exports.deleteUDP = factory.deleteOne(UDP.name);
//exports.getAnchorsByFloor = factory.getByfloorplan(Anchors.name)
