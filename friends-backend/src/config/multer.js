// https://github.com/learnwithsumit/express-js-tutorial/blob/lesson-23/index.js

const multer = require("multer");

// const storage = multer.diskStorage({
//   // configures destination location
//   destination: function (req, file, cb) {
//     //configs destination folder

//     const path =
//       process.env.IMAGE_UPLOAD_FOLDER +
//       "/" +
//       req.user._id +
//       "/" +
//       file.fieldname;

//     fs.mkdirSync(path, { recursive: true }); // Create directory if it does not exist

//     cb(null, path);
//   },
//   filename: function (req, file, cb) {
//     // configs file name
//     const uniqueSuffix =
//       Date.now() +
//       "-" +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);

//     cb(null, uniqueSuffix);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  )
    return cb(null, true);
  cb(new Error("Image can only be in jpeg, jpg or png format"));
};

module.exports = multer({
  storage,
  limits: { fileSize: 150000000 },
  fileFilter,
});
