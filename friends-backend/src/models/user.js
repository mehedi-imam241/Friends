const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    age: Number,
    password: {
      type: String,
      required: true,
    },
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: {
      type: [
        {
          token: {
            type: String,
            require: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

schema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

schema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "owner",
  options: {
    sort: { createdAt: -1 },
  },
});

// uncomment these to see if virtual populating is working or not.
// uncommenting these and populating on routes , you will see records getting populated

// schema.set("toObject", { virtuals: true });
// schema.set("toJSON", { virtuals: true });

// statics are for operation on Model directly
schema.statics.findByCredintials = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Unable to login");
  }

  return user;
};

// methods are for operation on instance of model
schema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jsonwebtoken.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Schema internal method to exclude password back in response
schema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.tokens;
  delete userObject.friends;

  return userObject;
};

schema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

module.exports = mongoose.model("User", schema);
