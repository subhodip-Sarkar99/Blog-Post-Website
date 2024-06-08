import User from "../models/user-model.js";

const test=async(req,res)=>{
    try {
        res.status(200).send("API Running...");
    } catch (error) {
        res.status(400).send({message:"API Not Responding"})
    }
};

//Registering users
const signUp= async(req,res)=>{
    
   
    try {
        const {username,email,password}=req.body;
        

        const userExist= await User.findOne({email:email});
        if(userExist){
            return res.status(400).json({message:"Email already registered"});
            
        }
        
        const createNewUser=await User.create({
            username,email,password
        });

        const {password:pass, ...rest}=createNewUser._doc;

        return res
        .status(201)
        .cookie('token',await createNewUser.generateToken(),{httpOnly:true,})
        .json({userdata: rest});

    } catch (error) {
        return res.status(500).json({message:"Error registering user",error});
    }
};

//Login
const login=async (req,res)=>{
    try {
        const {email,password}=req.body;

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(400).json({message:"Sign Up first"});
        }
        const user=await userExist.comparePassword(password);
         //console.log(user);
         //console.log("UserExist",userExist);

        const {password:pass, ...rest}=userExist._doc;

        if(user){
            return res
            .status(200)
            .cookie('token', await userExist.generateToken(),{httpOnly:true})
            .json({userdata: rest})
        }else{
            res.status(401).json({message:"Invalid email or password"});
        }

    } catch (error) {
       return res.status(500).json("Internal Server Error");
    }
};

const google=async(req,res)=>{
    const {email,name,googlePhotoUrl}=req.body;
    try {
         const checkUser=await User.findOne({email});
         if(checkUser){
           const token= await checkUser.generateToken();
           const {password, ...rest}=checkUser._doc;
           return res.status(200).cookie('token',token,{httpOnly: true}).json({userdata:rest});
         }else{
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
             
            const newUser=new User({
                username:
                    name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                    email,
                    password:generatedPassword,
                    profilePicture:googlePhotoUrl
            });
            await newUser.save();

            const token=await newUser.generateToken();
            const {password, ...rest}=newUser._doc;

            return res.status(200).cookie('token',token,{httpOnly: true}).json({userdata:rest});
         }
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }

}



export default {test,signUp,login,google};