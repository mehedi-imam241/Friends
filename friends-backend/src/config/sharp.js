const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sharpSingleUpload = async ({ user, file }) => {
  const directory =
    process.env.IMAGE_UPLOAD_FOLDER + "/" + user._id + "/" + file.fieldname;

  fs.mkdirSync(directory, { recursive: true });

  const uniqueSuffix =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + ".png";
  //path.extname(req.file.originalname); for extention name of original file if used instead of "".png"

  const newPath = directory + "/" + uniqueSuffix;

  await sharp(file.buffer).resize(100, 100).png().toFile(newPath);

  file.storagePath = newPath;
};

const sharpMultipleUpload = async (req) => {
  req.images = [];

  await Promise.all(
    req.files.map(async (file) => {
      const directory =
        process.env.IMAGE_UPLOAD_FOLDER +
        "/" +
        req.user._id +
        "/" +
        file.fieldname;

      fs.mkdirSync(directory, { recursive: true });

      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ".png";

      const newPath = directory + "/" + uniqueSuffix;

      await sharp(file.buffer)
        .resize({ width: 500 }) // resizes height automatically
        .png({ quality: 90 })
        .toFile(newPath);

      req.images.push(newPath);
    })
  );
};
module.exports = { sharpSingleUpload, sharpMultipleUpload };
