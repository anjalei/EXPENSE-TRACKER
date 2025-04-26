const Expense = require('../model/user');
const  fetchUser = async (req,res)=>{
    try{
        const expense=await User.findAll();
        res.json(user);
    }catch(error){
        res.status(500).json({error : "Something went wrong"});
    }
};
// const getUser = async (req,res)=>{
//     try{
//         const user = await Expense.findOne({where:{id:req.params.id}});
//         if(!user) return res.status(404).json({error : "User not found"})
//         res.json(user);
//     }catch(error){
//         res.status(500).json({error : "Something went wrong"});
//     }
// };
const addUser = async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        console.log(username,email,password);
        const newUser=await User.create({username,email,password})
        res.status(201).json(newUser);
    }catch(error){

        res.status(500).ison({error : "Something went wrong"});
    }
};
module.exports={fetchUser,addUser};