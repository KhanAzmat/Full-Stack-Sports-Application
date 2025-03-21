
const Gltf = require("../models/gltfModel");
const factory = require("./handlerFactory");

exports.getAllGltfs = factory.getAll(Gltf.name);
exports.getGltf = factory.getOne(Gltf.name);
exports.updateGltf = factory.updateOne(Gltf.name);
exports.deleteGltf = factory.deleteOne(Gltf.name);
exports.getGltfByFloor = factory.getByfloorplan(Gltf.name)
