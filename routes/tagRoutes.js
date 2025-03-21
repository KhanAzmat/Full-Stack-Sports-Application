const express = require("express");
const authController = require("./../controllers/authController");
const tagController = require("./../controllers/tagController");
const Tag = require("../models/tagModel");
const LinkedTag = require("../models/linkedTagModel");

const router = express.Router();

//Protect all routes after this middleware
router.use(authController.protect);

router.route("/count").get(tagController.tagsCount);
//Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("admin"));

router.get("/tagInfo/:id", tagController.getOneWithLinked) /* => {
  let tagMongoId = null;
  Tag.findOne({ tagId: req.params.id })
    .then((tagInfo) => {
      tagMongoId = tagInfo._id;

      LinkedTag.findOne({ tag: tagMongoId })
        .then((tagz) => res.json(tagz))
        .catch((err) => res.status(404).json("Linked Tag not Found"));
    })
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );

  // console.log(req.params);
  // console.log(tagInfo);
});*/

router.route("/").get(tagController.getAllWithLinked );

router.route("/").post(tagController.createTag);
router
  .route("/:id")
  .get(tagController.getTag)
  .patch(tagController.updateTag)
  .delete(tagController.deleteTag);
router.route("/multi/").post(tagController.createTags)
router.route("/tagid/:id").get(tagController.getTagByID)
module.exports = router;
