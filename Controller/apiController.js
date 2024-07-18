const UserModel=require('../Model/apiModel');
const bcrypt=require('bcryptjs');
const fs=require('fs');
const path=require('path');

const postForm=async(req,res)=>{
    try{
        if(!req.body.name){
            return res.status(401).json({
                success:false,
                message:"User name is required",
            });
        }
        else if(!req.body.email){
            return res.status(401).json({
                success:false,
                message:"Email is required",
            });
        }
        else if(!req.body.password){
            return res.status(401).json({
                success:false,
                message:"Password is required",
            });
        }
        else{
            let mail_verify=await UserModel.findOne({email_id:req.body.email});
            if(!mail_verify){
                let hashPassword=await bcrypt.hash(req.body.password,12);
                let user_images=req.files.map(images=>images.filename);
                let user_data=new UserModel({
                    name:req.body.name.toLowerCase(),
                    email:req.body.email,
                    password:hashPassword,
                    user_img:user_images,
                });
                let save_details=await user_data.save();
                console.log(save_details);
                if(save_details){
                    console.log("User details saved successfully");
                    return res.status(200).json({
                        success:true,
                        message:"User Details saved successfully",
                    });
                }
            }
            else{
                console.log("Email already exists");
            }
        }
        
    }
    catch(err){
        console.log("Error while collecting data",err);
        return res.status(401).json({
            success:false,
            message:err,
        });
    }
}
const viewForm=async(req,res)=>{
    try{
        let view_details=await UserModel.find().select(
            '_id name email password user_img'
        );
        if(view_details){
            return res.status(201).json({
                success:true,
                message:"User data fetched successfully",
                result:view_details,
            });
        }
    }
    catch(err){
        console.log("Error while fetching data");
        return res.status(401).json({
            success:false,
            message:"Data not fetched successfully"+err,
        });
    }
}
const deleteDetails=async(req,res)=>{
    try{
        let delete_details=await UserModel.findOneAndDelete({_id:req.params.id});
        console.log("Deleted data:",delete_details);
        if(delete_details){
           let filePath=path.join(__dirname,"..","uploads","user",delete_details.user_img);
           fs.unlinkSync(filePath);
           return res.status(204).json({
            success:true,
            message:"Data deleted successfully",
            result:delete_details,
        });
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error to delete data"+err,
        });
    }
}
const editForm=async(req,res)=>{
    try{
        let user_id=req.params.id;
        let user_image=req.files;
        let new_pass=await bcrypt.hash(req.body.password,12);
        let old_data=await UserModel.findById(user_id);
        old_data.name=req.body.name.toLowerCase()||old_data.name;
        old_data.email=req.body.email||old_data.email;
        old_data.password=new_pass||old_data.password;
        if(user_image==[]){
            old_data.user_img=old_data.user_img;
        }
        else{
            let filePath=path.join(__dirname,"..","uploads","user",old_data.user_img);
            console.log("Old image url:",filePath);
            fs.unlinkSync(filePath);
            let new_img=req.files.map(img=>img.filename);
            console.log("New image url:",new_img.path);
            old_data.user_img=old_data.new_img;
        }
        let updated_data=await old_data.save();
        if(updated_data){
            console.log("User data successfully updated",updated_data);
            return res.status(200).json({
                success:true,
                message:"User data successfully updated",
                result:updated_data,
            });
        }
    }
    catch(err){
        console.log("Error to update user details:",err);
        return res.status(401).json({
            success:false,
            message:"User data updation failed",
        });
    }
}
module.exports={
    postForm,
    viewForm,
    deleteDetails,
    editForm
}