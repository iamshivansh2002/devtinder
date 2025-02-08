const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            throw new Error(" token is not valid!!!!!")
        }
  
        const decodeObj= await jwt.verify(token,"sdfgasgj@fhf");
    
        const {_id}=decodeObj;
    
        const user=await  User.findById(_id);
        if(!user){
            throw new Error("user not find");
        }

        req.user=user;
        next(); 
    } catch (error) {
        res.status(400).send("error"+ error.message);
    }
    
}

module.exports={userAuth};