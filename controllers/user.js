const User = require("../models/userModel")
const {validationResult} = require('express-validator')
const  jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
exports.signUp= (req,res)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({
        error: errors.array()[0].msg
        })
    }
    const user= new User(req.body);
    user.save((err,user)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error: "Unable to add user"
            })
        }

        return res.status(200).json({
            message:"Success",
            //user,
        })
    });
}

exports.signIn = (req,res)=>{
    const {name,password} = req.body

    User.findOne({name},(err,user)=>{
        if(err ||!user) {
            return res.status(400).json({
                error:"Name was not Found"
            })
        }
        // Auth user
        if(!user.authenticate(password)){
            return res.status(400).json({
                error:"name and password does not match"
            })
        }

         // Create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // Put token in cookie
        res.cookie('token', token, {expire: new Date() + 1})

        // Send response
        const {_id, name} = user
        return res.json({
        token,
        user: {
            _id,
            name,
        }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    return res.json({
      message: "User siginout successful"
    })
  }

