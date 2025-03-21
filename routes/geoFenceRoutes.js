const express = require("express");
const authController = require("./../controllers/authController");
const geoFenceController = require("./../controllers/geoFenceController");

const router = express.Router();

//Protect all routes after this middleware
// router.use(authController.protect);

router.route("/count").get(geoFenceController.geofenceCount);
//Restrict all routes after this middleware to admin only
// router.use(authController.restrictTo("admin"));

router.route("/").get(geoFenceController.getAllGeoFences);
router.route("/").post(geoFenceController.createGeoFence);
router
  .route("/:id")
  .get(geoFenceController.getGeoFence)
  .patch(geoFenceController.updateGeoFence)

  router.route("/:deleteId").delete(geoFenceController.deleteGeo)

  router.route("/floorplan/:id").get(geoFenceController.getFeofenceByFloor)

module.exports = router;
