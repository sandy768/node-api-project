require('dotenv').config();
const express=require('express');
const appServer=express();
const PORT=process.env.PORT||3500;
const mongoose=require('mongoose');
const path=require('path');

const ApiRouter=require('./Router/ApiRouter');
const authRouter=require('./Router/authRouter');


appServer.use(express.urlencoded({extended:true}));
appServer.use(express.json());
appServer.use(express.static(path.join(__dirname,"..","uploads","user")));
appServer.use(express.static(path.join(__dirname,"..","uploads","auth")));

appServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
    next();
  });

appServer.use(ApiRouter);
appServer.use(authRouter);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})
.catch(err=>{
    console.log("Error to connect database",err);
})
