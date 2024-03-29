const Meme = require("../models/memeModel")
const MemeModel= require("../models/memeModel")
const {validationResult} = require('express-validator');
let express = require('express'),
    multer = require('multer'),
    uuidv4 = require('uuid/v4');
const { uploadFile, getFileStream ,s3} = require("./s3");
const fs =require("fs")
const util =require("util")
const unlinkFile=util.promisify(fs.unlink)


exports.getSingleMeme = (req, res) => {
    Meme.findById(req.query.id).then((doc)=>{
        return res.status(200).json(doc)
    })
     
  }
exports.searchText = (req,res,next)=>{
    let searchText = req.query.searchText
    Meme.find({
        $or: [{title: {$regex: searchText, $options : "i"}}]
      }).sort( [['_id', -1]] ).then(data => {
        res.status(200).json({
            message: "Meme search list retrieved successfully!",
            memes: data
        });
    })
}
exports.getAllMemes = (req, res, next) => {
    Meme.find().sort( [['_id', -1]] ).then(data => {
        res.status(200).json({
            message: "Meme list retrieved successfully!",
            memes: data
        });
  });
}
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
exports.upload = multer({
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

exports.getThreeMemes = (req,res,next)=>{
    Meme.find().sort( [['_id', -1]] ).limit(3) .then(data => {
        res.status(200).json({
            message: "Three Meme list retrieved successfully!",
            memes: data
        });
  });
}

exports.createMeme = async (req, res, next) => {
    const result=await uploadFile(req.file);
    //await unlinkFile(req.file.path);
    const Meme=  new MemeModel({
        memeImage: result.Location,
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
}
