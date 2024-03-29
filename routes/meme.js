let express = require('express')
let router = express.Router();
const {check} = require('express-validator')
const { Mongoose } = require('mongoose');
const { getSingleMeme,getAllMemes,createMeme,upload,searchText,getThreeMemes} = require('../controllers/memes');

router.post('/memeCreate', upload.single('memeImage'), createMeme)
router.get("/memes", getAllMemes);

router.get("/meme", getSingleMeme)
router.get("/search",searchText)
router.get("/threeMemes",getThreeMemes)
module.exports = router;