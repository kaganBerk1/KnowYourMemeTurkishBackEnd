const mongoose = require("mongoose")
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const MemeModel= new mongoose.Schema({
    admin:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique : true
    },
    writerNote:{
        type: String,
    },
    origin:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    memeImage: {
        type: String
    },
    relatedLinks:{
        type:[String],
     }
},{
    timestamps:true,
})



module.exports = mongoose.model("MemeModel", MemeModel)