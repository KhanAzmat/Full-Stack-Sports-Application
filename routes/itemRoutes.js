const express = require("express");
const authController = require("./../controllers/authController");
const itemController = require("./../controllers/itemController");

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

//Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("admin"));

router.route("/").get(itemController.getAllItems);
router.route("/").post(itemController.createItem);
router
  .route("/:id")
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
