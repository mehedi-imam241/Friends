const mongoose = require("mongoose"); // new

mongoose.connect("mongodb://localhost:27017/friends", { useNewUrlParser: true });
