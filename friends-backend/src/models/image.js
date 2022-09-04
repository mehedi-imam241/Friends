const mongoose = require("mongoose");
const Post = require("./post");

const imageSchema = new mongoose.Schema(
  {
    title: String,
    type: {
      type: String,
      enum: ["upload", "avatar"],
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.methods.saveAvatar = async function (title) {
  const image = this;
  const post = new Post({
    type: "avatar",
    owner: image.owner,
    ...(title && { title }),
  });
  image.post = post._id;

  await post.save();
};

imageSchema.methods.saveMultipleImage = function (post) {
  this.post = post._id;
};

imageSchema.methods.toJSON = function () {
  const imageObject = this.toObject();

  delete imageObject.type;
  delete imageObject.owner;
  delete imageObject.post;
  delete imageObject.storagePath;

  return imageObject;
};

module.exports = mongoose.model("Image", imageSchema);
