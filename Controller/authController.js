const AuthModel=require('../Model/authModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const postAuthReg=async(req,res)=>{
    try{
        if(!req.body.username){
            return res.status(401).json({
                success:false,
                message:"User name is required",
            });
        }
        else if(!req.body.gender){
            return res.status(401).json({
                success:false,
                message:"Gender is required",
            });
        }
        else if(!req.body.dob){
            return res.status(401).json({
                success:false,
                message:"Date of Birth is required",
            });
        }
        else if(!req.body.email){
            return res.status(401).json({
                success:false,
                message:"email is required",
            });
        }
        else if(!req.body.password){
            return res.status(401).json({
                success:false,
                message:"Password is required",
            });
        }
        else{
            let user_data=await AuthModel.findOne({email:req.body.email});
            if(!user_data){
                let hashPassword=await bcrypt.hash(req.body.password,12);
                let details=new AuthModel({
                    username:req.body.username.toLowerCase(),
                    gender:req.body.gender.toLowerCase(),
                    dob:req.body.dob,
                    email:req.body.email,
                    password:hashPassword,
                    user_image:req.file.filename,
                });
                let saved=await details.save();
                if(saved){
                    console.log("User data saved successfully",saved);
                    return res.status(200).json({
                        success:true,
                        message:"Registration successful",
                        status:200,
                    });
                }
            }
            else{
                console.log("Existing user");
                return res.status(201).json({
                    success:false,
                    message:"Existing user,try with another email id",
                    status:201,
                });
            }
        }
    }
    catch(err){
        console.log("Error to collect data",err);
        return res.status(401).json({
            success:false,
            message:"Error to collect data" +err
        })
    }
}
const postAuthLog=async(req,res)=>{
    try{
        if(!req.body.email){
            return res.status(401).json({
                success:false,
                message:"email is required",
            });
        }
        else if(!req.body.password){
            return res.status(401).json({
                success:false,
                message:"Password is required",
            });
        }
        else{
            let existing_user=await AuthModel.findOne({email:req.body.email});
            if(existing_user){
                let pass_match=await bcrypt.compare(req.body.password,existing_user.password);
                if(pass_match){
                    let token_payload={userdata:existing_user};
                    const token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
                        expiresIn:"1h",
                    });
                    return res.status(200).json({
                        success:true,
                        message:"Login successfully done",
                        status:200,
                        token:token_jwt,
                    });
                }
                else{
                    return res.status(201).json({
                        success:false,
                        message:"Incorrect password",
                        status:201,
                    });
                }
            }
            else{
                return res.status(201).json({
                    success:true,
                    message:"Invalid user",
                    status:201,
                });
            }
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error to login" +err,
            status:401,
        });
    }
}
const viewProfile=async(req,res)=>{
    try{
        let view_data=req.user.userdata;
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            status:200,
            user_view:view_data,
        });
    }
    catch(err){
        console.log("Error to fetch user data");
        return res.status(401).json({
            success:false,
            message:"Error to fetch user data" +err,
            status:401,
        });
    }
}
module.exports={
    postAuthReg,
    postAuthLog,
    viewProfile
}