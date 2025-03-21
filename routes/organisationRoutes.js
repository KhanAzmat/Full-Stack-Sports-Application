const express = require("express");
const authController = require("./../controllers/authController");
const organisationController = require("./../controllers/organisationController");

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("admin", "user"));

router.route("/").get(organisationController.getAllOrganisations);
router.route("/").post(organisationController.createOrganisation);
router
  .route("/:id")
  .get(organisationController.getOrganisation)
  .patch(organisationController.updateOrganisation)
  .delete(organisationController.deleteOrganisation);

module.exports = router;
