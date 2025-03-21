const MQTT = require("../models/mqttModel");
const factory = require("./handlerFactory");

exports.getMQTT = factory.getAll(MQTT.name);
exports.deleteMQTT = factory.deleteOne(MQTT.name);

