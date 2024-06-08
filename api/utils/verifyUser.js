import jwt from "jsonwebtoken";
import env from 'dotenv';

env.config();

const verifyToken= (req,res,next)=>{
   const token=req.cookies.token; 
   if(!token){
    return res.status(401).send({message:"Unauthorized"});
    
   }
   jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
    if(err){
      return res.status(401).send({message:"Unauthorized"});
    }
    req.user=user;
    //console.log(user);
    next();
   });
};

export default verifyToken;
