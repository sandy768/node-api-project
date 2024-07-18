const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AuthSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_image:{
        type:String,
        required:false
    },
},{
    timestamps:true,
    versionKey:false,
});

const AuthModel=new mongoose.model("auth_details",AuthSchema);
module.exports=AuthModel;