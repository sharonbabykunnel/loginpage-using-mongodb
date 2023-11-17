const mongoose =  require("mongoose");

const userSchama = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uniqe:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        required:true,
        default:0
    }
});


module.exports = mongoose.model("User",userSchama);