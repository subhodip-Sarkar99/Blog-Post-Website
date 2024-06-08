import User from "../models/user-model.js";

const updateUser= async(req,res)=>{
    //console.log(req.user);
    if(req.user.userId!==req.params.userId){
        return res.status(403).json('You are not allowed to update this user');
    }
    try {
        //console.log(req.body);
        const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, {new:true});
    
    const {password, ...rest}= updatedUser._doc;
    res.status(200).json({userdata:rest});
    } catch (error) {
        return res.status(500).json('Internal Server error');
    }
    
};

const deleteUser=async(req,res)=>{
    //console.log(req.params.id);
    if(!req.user.userId && req.user.userId !== req.params.userId){
        return res.status(403).json("You aren't allowed to delete the user");
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User deleted Successfully');
    } catch (error) {
        return res.status(500).json('Internal Server error');
    }
};

const signout=async (req,res)=>{
    try {
        res.clearCookie('token').status(200).json('User has been Signed Out');

    } catch (error) {
        return res.status(500).json('Internal Server error');
    }
};

const getUsers=async(req,res)=>{
    if(!req.user.isAdmin){
        return res.status(403).json('You are not allowed to see all users');
    }
    try {
       const startIndex= parseInt(req.query.startIndex) || 0;
       const limit= parseInt(req.query.limit) || 9;
       const sortDirection= req.query.sort==='asc' ? 1 : -1;

       const users= await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);

       const usersWithoutPasswords= users.map((user)=>{
            const {password, ...rest}=user._doc;
            return rest;
       });
       const totalUsers= await User.countDocuments();

       const now=new Date();

       const oneMonthAgo= new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
       );
       
       const lastMonthUsers= await User.countDocuments({
        createdAt: {$gte: oneMonthAgo},
       });

       return res.status(200).json({
        users:usersWithoutPasswords,
        totalUsers,
        lastMonthUsers
    });

    } catch (error) {
        return res.status(500).json('Internal Server error');
    }
};

const getUser=async (req,res)=>{
    try {
        const user= await User.findById(req.params.userId);
        if(!user){
            return res.status(404).json('User not Found');
        }
        const {password, ...rest}=user._doc;
        return res.status(200).json(rest);
    } catch (error) {
        return res.status(500).json('Internal Server error');
    }
}



export default {updateUser,deleteUser,signout,getUsers,getUser};