import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
       
    },
    profilePicture:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", 
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

//Securing Passwords using bcrypt
userSchema.pre('save',async function(next){
    const user=this;

    if(!user.isModified("password")){
        next();
    }

    try {
        const saltRounds=await bcrypt.genSalt(12);
        const hash_pass=await bcrypt.hash(user.password,saltRounds);
        user.password=hash_pass;
    } catch (error) {
        next(error);
    }
});

userSchema.pre('findOneAndUpdate',async function(next){
    const updatedPass=this._update.$set.password;
    //console.log('pre->',this._update);
    if(!updatedPass){
        next();
    }
    try {
        const saltRounds=await bcrypt.genSalt(12);
        const hash_pass=await bcrypt.hash(updatedPass,saltRounds);
        this._update.$set.password=hash_pass;
    } catch (error) {
        next(error)
    }


});

//JSON Web Token
userSchema.methods.generateToken= function(){
    try {
        return jwt.sign({
            userId:this._id.toString(),
            //email:this.email,
            isAdmin:this.isAdmin
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:"10h"
        }
    );
    } catch (error) {
        console.log("Token generation error");
    }
};

//Comparing password for login route
userSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password,this.password);
};

const User= new mongoose.model("user",userSchema);

export default User;