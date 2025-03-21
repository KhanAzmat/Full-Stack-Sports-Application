const express = require("express");
const authController = require("./../controllers/authController");
const linkedTagPlayerController = require('./../controllers/linkedTagPlayerController')

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only
// router.use(authController.restrictTo("admin"));

router.route("/").get(linkedTagPlayerController.getAllLinkedTagPlayers);
router.route("/").post(linkedTagPlayerController.createLinkedTagPlayer);
router
  .route("/:id")
//   .get(linkedTagController.getLinkedTag)
//   .patch(linkedTagController.updateLinkedTag)
  .delete(linkedTagPlayerController.deleteLinkedTagPlayer);

//   router.route("/tag/:id").get(linkedTagController.getLinkedTagByTag)

router.route('/savePlaybackData').post(linkedTagPlayerController.savePlaybackData);
router.route('/getPlaybackData/:id').get(linkedTagPlayerController.getPlaybackData);
router.route('/getAllLaps').get(linkedTagPlayerController.getAllLaps);
router.route('/getLapsByCriteria').get(linkedTagPlayerController.getLapsByCriteria);
router.route('/getPlayersByDate').get(linkedTagPlayerController.getPlayersByDate)

module.exports = router;
