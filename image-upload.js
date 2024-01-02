//console.log(" console.log(process.cwd());",process.cwd());
const multer = require('multer');
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("./public/uploads/product/")) {
      fs.mkdirSync("./public/uploads/product/")
    }
    cb(null, './public/uploads/product/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + " " + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25
  },
  fileFilter: fileFilter
});
