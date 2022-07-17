const mongoose = require("mongoose")
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlenghth:32,
        trim:true,
        unique : true
    },
    encry_password:{
        type: String,
        required:true,
    },
    salt:String,   
},{
    timestamps:true,
})

userSchema.virtual("password").set( function(password){
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
}).get(()=>{
    return this._password
})

userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword)===this.encry_password
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "Password Not Found";
        try{
            return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
        }catch(err){
            return `Something goes wrong in hashing \n ${err}`
        }
    }
}

module.exports = mongoose.model("UserModel", userSchema)