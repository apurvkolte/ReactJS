const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("./public/uploads/banner")) {
      fs.mkdirSync("./public/uploads/banner")
    }
    cb(null, './public/uploads/banner');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + " " + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload_banner = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
