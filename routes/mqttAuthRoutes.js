const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const apiKeyController = require("../controllers/apiKeyController")

const router = express.Router();


function mqttAllow(req,res,next)
{
    res.status(200).send("allow")
}


///Mqtt validation routes
router.post("/user",apiKeyController.verifyKey);
router.post("/vhost",mqttAllow)
router.post("/resource",mqttAllow);
router.post("/topic",mqttAllow)

router.use(authController.protect);
//router.use(authController.restrictTo("admin"));
//router.use("/keys/",apiKeyController.getAll)
//router.route("/key/")
//      .post(apiKeyController.createApiKey);
//router.route("/key/:id")
//      .delete(apiKeyController.deleteKey)





//Protect all routes after this middleware


module.exports = router;
