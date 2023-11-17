
const User = require("../models/userModel");
const bcrypt = require("bcrypt");



const securePassword = async(password) =>{
    try {
        const spassword = await bcrypt.hash(password,10);
        return spassword;
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res) =>{

    try {
        res.render("registration");
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res) =>{

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
        name:req.body.name,
        email:req.body.email,
        image:req.file.filename,
        mobile:req.body.mobile,
        password:spassword,
        is_admin:0
        });

        const userData = await user.save();

        if(userData){


            res.render("registration",{message:"Your registration has been successfully submited. Pleas verify your mail."});
            
        }else{
            res.render("registration",{message:"registration has been failed."});
        }
    } catch (error) {
        console.log(error.message);
    }
}


//login user method start

const loadLogin = async(req,res) =>{
      try {

        res.render('loginPage');

      } catch (error) {
        console.log(error.message);
      }
}

//for verify login

const verifyLogin = async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect('/home');
                return
            } else {
                res.render('loginPage',{message:"Invalid Password.Please Retry"});
                return
            }
        } else {
            res.render('loginPage',{message:"Email and Passowrd are incorrect"});
            return
        }
    } catch (error) {
        console.log(error.message);
    }
}

// for load homePage

const loadHome = async(req,res) =>{
    try {
        res.render('homePage');
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async(req,res) =>{
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout
};