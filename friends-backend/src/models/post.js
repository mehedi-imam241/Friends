const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    content: String,
    type: {
      type: String,
      enum: ["post", "avatar"],
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("Images", {
  ref: "Image",
  localField: "_id",
  foreignField: "Post",
});

module.exports = mongoose.model("Post", schema);
