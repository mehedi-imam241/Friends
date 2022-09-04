const mongoose = require("mongoose"); // new

mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });
