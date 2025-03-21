const express = require("express");
const authController = require("./../controllers/authController");
const linkedTagController = require("./../controllers/linkedTagController");

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("admin"));

router.route("/").get(linkedTagController.getAllLinkedTags);
router.route("/").post(linkedTagController.createLinkedTag);
router
  .route("/:id")
  .get(linkedTagController.getLinkedTag)
  .patch(linkedTagController.updateLinkedTag)
  .delete(linkedTagController.deleteLinkedTag);

  router.route("/tag/:id").get(linkedTagController.getLinkedTagByTag)

module.exports = router;
