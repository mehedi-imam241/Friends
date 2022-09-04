const express = require("express");
require("./db/mongoose");
require("dotenv").config();
const postRoutes = require("./routes/PostRoutes");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use("/api", postRoutes);
app.use("/api", userRoutes);
app.use("/api", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
