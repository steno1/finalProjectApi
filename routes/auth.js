const router=require("express").Router();
const User=require("../model/User.js");
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken");

//Register
router.post("/register",  async (req,res)=>{
    //create a new user
    
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
            ).toString(),
    });
    try{
    //saving inside db
    const user= await newUser.save();
    return res.status(201).json(user);
}catch(err){
    return res.status(500).json(err);
}
});

//login
router.post("/login", async (req, res)=>{
    try{
const user=await User.findOne({email:req.body.email});
if(!user){
    return res.status(401).json("user does not exist");
    
}
// Decrypt
const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
const originalpassword = bytes.toString(CryptoJS.enc.Utf8);
if(originalpassword !==req.body.password){
return res.status(404).json("wrong username or password")
}else{
    //before sending the user info create a jwt token
    const accessToken=jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin,
    /* it will hide the id and isAdmin in the token*/
    }, process.env.SECRET_KEY, {expiresIn:"7d"})
    const {password, ...info}=user._doc;
    return res.status(200).json({
        ...info,
        accessToken
/* means, it contains info and in addition to accessToken*/
    });
}
    }catch(err){
        return res.status(500).json(err)
    }
})

module.exports=router;