const express = require("express");
const Post = require("../models/post");
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const { sharpMultipleUpload } = require("../config/sharp");
const Image = require("../models/image");

const router = express.Router();

// get single post of a user
router.get("/posts/me/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!post) {
      res.status(404).send({ error: "Post not found" });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all posts of a  user
router.get("/posts/me", auth, async (req, res) => {
  try {
    const match = {},
      sort = {};

    // if (req.query.)

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split("_");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user.populate({
      path: "posts",
      // match: {title : balchal}, will match only balchal title and send those
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });

    await req.user.posts.populate("Images");

    console.log(req.user.posts);

    res.send(req.user.posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/posts/me", auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      owner: req.user._id,
    });
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/posts/me/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "content", "type"];
  const isValidOperation = updates.every((update_name) =>
    allowedUpdates.includes(update_name)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    console.log(post);
    updates.forEach((update) => (post[update] = req.body[update]));
    await post.save();
    res.send(req.post);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/posts/me/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!post) {
      res.status(404).send({ error: "Post not found" });
    }
    res.send("Post Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/posts/me/:postID/images",
  auth,
  upload.array("images"),
  // upload.any(),
  async (req, res) => {
    try {
      await sharpMultipleUpload(req);

      await Promise.all(
        req.images.map(async (storagePath) => {
          const image = new Image({
            type: "upload",
            owner: req.user._id,
            post: req.params.postID,
            storagePath,
          });
          await image.save();
        })
      );
      res.send({ message: "Images uploaded successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Image not uploaded" });
    }
  }
);

router.patch("/posts/me/images/:imageID", auth, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.imageID,
      owner: req.user._id,
      type: "upload",
    });

    if (!image) {
      return res.status(404).send({ message: "Image not found" });
    }

    if (!req.body.title) throw new Error();

    image.title = req.body.title;

    await image.save();

    res.send({ message: "Image updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not edit" });
  }
});

router.delete("/posts/me/images/:id", auth, async (req, res) => {
  try {
    const image = await Image.findOneAndDelete({
      type: req.params.id,
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

module.exports = router;
