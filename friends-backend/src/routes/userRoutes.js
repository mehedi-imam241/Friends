const express = require("express");
const fs = require("fs");
const User = require("../models/user");
const Post = require("../models/post");
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const { sharpSingleUpload } = require("../config/sharp");
const Image = require("../models/image");
const path = require("path");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/users/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredintials({
      email: req.body.email,
      password: req.body.password,
    });
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Update user profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age"];
  const isValidOperation = updates.every((update_name) =>
    allowedUpdates.includes(update_name)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // delete previous avatar if they have any
      // const prevImage = await Image.findOne({
      //   type: "avatar",
      //   owner: req.user._id,
      // });
      // if (prevImage) {
      //   await prevImage.delete();
      //   fs.unlinkSync(prevImage.storagePath);
      // }

      // create new image
      await sharpSingleUpload(req);
      const image = new Image({
        type: "avatar",
        storagePath: req.file.storagePath,
        owner: req.user._id,
      });
      image.saveAvatar(req.body.title);
      await image.save();
      res.send({ message: "Image uploaded successfully" });
    } catch (error) {
      if (req.storagePath) {
        fs.unlinkSync(req.storagePath);
      }
      console.log(error);
      res.status(401).send({ message: "Could not upload. Try again" });
    }
  }
);

router.patch("/users/me/avatar/:id", auth, async (req, res) => {
  try {
    const avatar = await Image.findOne({ _id: id, owner: req.user._id });

    if (!avatar) {
      return res.status(404).send({ message: "Not found" });
    }

    const post = await Post.findOne({
      owner: req.user._id,
      _id: avatar.post,
    });

    if (!post) {
      return res.status(404).send({ message: "Not found" });
    }
    post.title = req.body.title;

    await post.save();

    res.send({ message: "Title has been updated!" });
  } catch (error) {
    res.status(500).send({ error: "Not updated" });
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    const image = await Image.findOneAndDelete({
      type: "avatar",
      owner: req.user._id,
    });
    if (!image) {
      return res.status(404).send({ message: "Image not found" });
    }
    fs.unlinkSync(image.storagePath);
    res.send({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(401).send({ message: "Could not delete. Try again" });
  }
});

// type = avatar

router.get("/users/:id/getImages", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "images",
      match: {
        ...(req.query.type && { type: req.query.type }),
      },
      options: {
        skip: parseInt(req.query.skip),
        limit: parseInt(req.query.limit),
      },
    });
    res.send(user.images);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/me/acceptFriendRequest/:id", auth, async (req, res) => {
  try {
    req.user.friends.push(req.params.id);
    console.log(req.user);
    await req.user.save();
    res.send({ message: "You are friends now!" });
  } catch (error) {
    res.status(500).send({ Error: "Error. Try again!" });
  }
});

module.exports = router;
