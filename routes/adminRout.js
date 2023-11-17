const express = require('express');
const admin_rout = express();

const session = require('express-session');
const bodyParser =  require('body-parser');
const adminController = require('../controller/adminController');
const config = require('../config/config');
const auth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');

const nocache = require('nocache');

admin_rout.use(nocache());

admin_rout.use(express.static('public'));




const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
     cb(null,path.join(__dirname,"../public/userImages"));
    },
    filename:(req,file,cb) =>{
        const name = Date.now()+"-"+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

admin_rout.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

admin_rout.use(bodyParser.urlencoded({extended:true}));
admin_rout.use(bodyParser.json());

admin_rout.set("view engine","ejs");
admin_rout.set("views","./views/admin");

admin_rout.get('/',auth.isLogout,adminController.loadLogin);
admin_rout.post('/login',adminController.verifyLogin);
admin_rout.get('/home',auth.isLogin,adminController.loadHome);
admin_rout.get('/logout',auth.isLogin,adminController.logout);
admin_rout.get('/dashboard',auth.isLogin,adminController.loadDashboard);
admin_rout.get('/new-user',auth.isLogin,adminController.loadnewuser);
admin_rout.post('/new-user',upload.single('image'),adminController.addnewUser);
admin_rout.get('/edit-user',auth.isLogin,adminController.loadEditUser);
admin_rout.post('/edit-user',adminController.editUser);
admin_rout.get('/delete-user',auth.isLogin,adminController.deleteUser);
// admin_rout.post('/delete-user',adminController.deleteUser);


admin_rout.get('*',adminController.author);
module.exports = admin_rout;