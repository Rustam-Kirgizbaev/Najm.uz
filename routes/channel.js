const express = require("express");
const router = express.Router();
const ChannelController = require("../controller/channel");

router.get("/", ChannelController.getAll);
router.get("/:id", ChannelController.get);
router.post("/", ChannelController.create);
router.patch("/:id", ChannelController.update);
router.patch("/:id/delete", ChannelController.delete);
router.delete("/:id", ChannelController.remove);

module.exports = router;
