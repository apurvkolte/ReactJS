const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary;


//user.js
const router = require("express").Router()
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

const User = require("../model/user");
const { append } = require("express/lib/response");
const { path } = require("express/lib/application");
router.post('/', upload.array('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" })

        //mongo
        //Create instance of user
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        });
        //Save user
        await user.save();
        res.json(user);
    }
    catch (err) {
        console.log(err)
    }
});

router.get("/", async (req, res) => {
    try {
        let user = await User.find();
        res.json(user);
    } catch {
        console.log(err)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        //Find by user id
        let user = await User.findById(req.params.id);

        //1. Delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);
        //2. Delete user from db
        await user.remove();
        res.json(user);
    } catch (err) {
        console.log(err)
    }
});


//update
router.put("/:id", upload.array("image"), async (req, res) => {
    try {
        //get uer data from db
        let user = await User.findById(req.params.id);
        //delete image in cloudoinary bu get id in db
        await cloudinary.uploader.destroy(user.cloudinary_id);
        // Upload image to cloudinary
        let result;
        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
        }
        const data = {
            name: req.body.name || user.name,
            avatar: result?.secure_url || user.avatar,
            cloudinary_id: result?.public_id || user.cloudinary_id,
        };
        user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(user);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;



//multer.js
const multer = require('multer');
const path = require('path');

//Multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});