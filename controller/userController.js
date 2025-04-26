const User = require('../model/user');
const  fetchUser = async (req,res)=>{
    try{
        const users=await User.findAll();
        res.json(users);
    }catch(error){
        res.status(500).json({error : "Something went wrong"});
    }
};

const addUser = async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        console.log(username,email,password);
        const newUser=await User.create({username,email,password})
        res.status(201).json(newUser);
    }catch(error){

        res.status(500).json({error : "Something went wrong"});
    }
};
module.exports={fetchUser,addUser};