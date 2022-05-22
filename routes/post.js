const express = require("express");
const router = express.Router();
const PostController = require("../controller/post");

router.get("/", PostController.getAll);
router.get("/:id", PostController.get);
router.post("/", PostController.create);
router.patch("/:id", PostController.update);
router.delete("/:id", PostController.delete);

module.exports = router;
