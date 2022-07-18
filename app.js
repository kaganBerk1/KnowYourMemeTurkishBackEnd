const mongoose = require("mongoose")
const express = require("express")
require("dotenv").config();
const app= express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");


/// DB Connection

mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>{
    console.log("DB Connect")
}).catch((err)=>{
    console.log("NOT CONNECTED")
    console.log(err)
})

/// Parsing Middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(cors());

// import  the routes
const userRoutes = require("./routes/user.js")
const memeRoutes = require("./routes/meme.js")

/// using route

app.use("/api",userRoutes);
app.use("/api",memeRoutes);
// PORT
const port=process.env.PORT;

/// starting server

app.listen(port,()=>{
    console.log("Server is listening...")
})


