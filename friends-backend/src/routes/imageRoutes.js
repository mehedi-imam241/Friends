const express = require("express");
const fs = require("fs");
const User = require("../models/user");
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const sharp = require("../config/sharp");
const Image = require("../models/image");
const path = require("path");

const router = express.Router();

router.get("/images/:imageID", async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageID);
    if (!image) {
      return res.status(404).send({ error: "Not found" });
    }
    const imgBuffer = fs.readFileSync(image.storagePath);
    res.set("Content-Type", "image/png");
    res.send(imgBuffer);
  } catch (error) {
    res.status(500).send({ error: "Error !" });
  }
});

module.exports = router;
