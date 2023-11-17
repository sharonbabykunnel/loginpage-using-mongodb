const User = require('../models/userModel');
const bcrypt = require('bcrypt');


const securePassword = async(password) =>{
    try {
        const spassword = await bcrypt.hash(password,10);
        return spassword
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req,res) =>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const adminData = await User.findOne({email:email});

        if (adminData) {
            const passwordMatch = await bcrypt.compare(password,adminData.password);

            if (passwordMatch) {
                if (adminData.is_admin === 1) {
                    req.session.admin_id = adminData._id;
                    res.redirect('/admin/home');
                    return
                }else{
                    res.render('login',{message:"You are not an Admin."});
                }
            } else {
                res.render('login',{message:"Your Password is incorrect.Please try again"});
            }
        } else {
            res.render('login',{message:"Email and Password are incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res) =>{
    try {
        console.log('sff');
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
}

const author = async(req,res) =>{
try {
    res.redirect('/admin');
} catch (error) {
    console.log(error.message)
}
}

const logout = async(req,res) =>{
    try {
        req.session.destroy();
        res.redirect('/admin');
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res) =>{
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
        const userData = await User.find({
            is_admin:0,
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'} },
                {email:{$regex:'.*'+search+'.*',$options:'i'} }
                
            ]
        });
        res.render('dashboard',{users:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const loadnewuser = async(req,res) =>{
    try {
        res.render('newUser');
    } catch (error) {
        console.log(error.message);
    }
}

const addnewUser = async(req,res) =>{
    try {
        const spassword = await securePassword(req.body.password);
        
        
        const user =  new User({
            name:req.body.name,
            email:req.body.email,
            image:req.file.filename,
            mobile:req.body.mobile,
            password:spassword,
            is_admin:0,
            is_varified:1

        });
        const userData = await user.save();

        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('newUser',{message:"sothing wrong"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadEditUser = async(req,res) =>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});

        if (userData) {
            res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editUser = async(req,res) =>{
   try {
    // if(req.body.id){
    //     console.log('dsf')
    // }else{
    //     console.log('olkjfrep')
    // }
    const data = await User.findOne({_id:req.body.id})
    const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,mobile:req.body.mobile,is_varified:req.body.verify}});
    console.log(userData)
    console.log(data)
    
        res.redirect('/admin/dashboard');
    
        
    
   } catch (error) {
    console.log(error.message);
   }
}

// const loadDeleteUser = async(req,res) =>{
//     try {
//         const userData = await User.findById({_id:req.body.id})
//         if (userData) {
//             res.render('delete-user',{user:userData}); 
//         } else {
//             res.redirect('/admin/home');
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const deleteUser = async(req,res) =>{
    try {
        const id = req.query.id;
         await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    logout,
    author,
    loadDashboard,
    loadnewuser,
    addnewUser,
    loadEditUser,
    editUser,
    deleteUser
}