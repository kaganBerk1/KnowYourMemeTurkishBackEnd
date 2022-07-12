const express=require("express")
const { signUp,signIn,signout } = require("../controllers/user")
const router = express.Router()
const {check} = require('express-validator')

router.post("/signup",[  
check("name", "Name atleast should be 3 characters").isLength({min: 3}),
check("password", "Password at least should be 6 characters").isLength({min: 6}),
],signUp)

router.post("/signin",[  
    check("name", "Name atleast should be 3 characters").isLength({min: 3}),
    check("password", "Password at least should be 6 characters").isLength({min: 6}),
],signIn)

router.get("/signout", signout)

module.exports = router