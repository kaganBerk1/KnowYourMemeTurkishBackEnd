const Meme = require("../models/memeModel")
exports.getSingleMeme = (req, res) => {
    
    //console.log(req)
    Meme.findById(req.query.id).then((doc)=>{
        //console.log(doc)
        return res.status(200).json(doc)
    })
    
  }