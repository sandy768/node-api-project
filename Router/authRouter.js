const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const AuthJwt=require('../Middle-ware/isAuth');
const {postAuthReg,postAuthLog,viewProfile} = require('../Controller/authController');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","auth"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    },
});
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    ){
        callback(null,true);
    }
    else{
        callback(null,false);
    }
}
const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5},
});
const upload_type=upload.single("user_image");

router.post('/auth/postreg',upload_type,postAuthReg);
router.post('/auth/postlog',postAuthLog);
router.get('/auth/view',AuthJwt.authJwt,viewProfile);

module.exports=router;