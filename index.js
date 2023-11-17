const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/userdb");


const express = require("express");
const app = express();



//for user routes
const userRoute = require("./routes/userRout");

app.use(express.static("public"));

app.use("/",userRoute);


//for admin routes
const adminRout = require("./routes/adminRout");

app.use('/admin',adminRout);

app.listen(5218,(req,res) =>{
    console.log("The server is running at http://127.0.0.1:5218/");
})