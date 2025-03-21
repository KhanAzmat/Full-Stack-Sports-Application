const express = require("express");
const authController = require("./../controllers/authController");
const buildingController = require("./../controllers/buildingController");

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

router.route("/count").get(buildingController.buildingCount);
//Restrict all routes after this middleware to admin only


router.route("/").get(authController.restrictTo("admin", 'user'), buildingController.getAllBuildings);
router.route("/").post(authController.restrictTo("admin"), buildingController.createBuilding);


router
  .route("/:id")
  .get(authController.restrictTo("admin", 'user'), buildingController.getBuilding)
  .patch(authController.restrictTo("admin"), buildingController.updateBuilding)
  .delete(authController.restrictTo("admin"), buildingController.deleteBuilding);

module.exports = router;
