const MemeModel = require('../models/memeModel');
let express = require('express'),
    multer = require('multer'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();
const {check} = require('express-validator')
const {validationResult} = require('express-validator');
const { Mongoose } = require('mongoose');
const { getSingleMeme } = require('../controllers/memes');
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/memeCreate', upload.single('memeImage'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log(req.body.relatedLinks)
    const Meme=  new MemeModel({
        memeImage: url + '/public/' + req.file.filename,
        title: req.body.title,
        description: req.body.description,
        origin: req.body.origin,
        relatedLinks: req.body.relatedLinks,
        writerNote: req.body.writerNote,
        admin: req.body.admin,
    });
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({
        error: errors.array()[0].msg
        })
    }
    Meme.save().then(result => {
        res.status(201).json({
            message: "Meme Createdsuccessfully!",
            memeCreated: {
                _id: result._id,
                title: result.title,
                adminNotes: result.adminNotes,
                origin: result.origin,
                description: result.description,
                memeImage: result.memeImage,
                relatedLinks: result.relatedLinks,
                writerNote: req.body.writerNote,
                admin: req.body.admin,
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})
router.get("/memes", (req, res, next) => {
    MemeModel.find().then(data => {
        res.status(200).json({
            message: "Meme list retrieved successfully!",
            memes: data
        });
    });
});

router.get("/meme", getSingleMeme)
module.exports = router;