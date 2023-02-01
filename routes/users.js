const router=require("express").Router();
const User=require("../model/User.js");
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken");
const verify=require("../verifyToken.js")

//update Route
router.put("/:id",verify, async (req, res)=>{
   if(req.user.id===req.params.id || req.user.isAdmin){
//check if we are changing password in order to encrypt it
if(req.body.password){
    req.body.password=CryptoJS.AES.encrypt( req.body.password,
         process.env.SECRET_KEY
        ).toString();
}
try{
const updatedUser=await User.findByIdAndUpdate(req.params.id,
    {$set:req.body}, {new:true});
    //const {password, ...info}=user._doc;
    return res.status(200).json(updatedUser)
}catch(error){
    return res.status(500).json(error)
}
   }else{
    return res.status(403).json("you can update only your account")
   }
})

//delete
router.delete("/:id", verify, async(req, res)=>{
if(req.user.id===req.params.id || req.user.isAdmin){
    try{
await User.findByIdAndDelete(req.params.id);
return res.status(200).json("user has been deleted")
    }catch(err){
        return res.status(500).json(err)
    }
}else{
return res.status(403).json("you can delete only your account")
}
})
//get
router.get("/find/:id", verify, async(req, res)=>{
try{
const newUsers=await User.findById(req.params.id);
const {password, ...info}=newUsers._doc;
return res.status(200).json(info)
}catch(err){
return res.status(500).json(err)
}
})
//get all users

router.get("/", verify, async (req, res)=>{
    const query=req.query.steno;
    if(req.user.isAdmin){
try{
const allUser= query? await User.find().sort({_id:-1}).limit(10):await User.find();

return res.status(200).json(allUser)
}catch(err){
return res.status(500).json(err)
}
    }else{
        return res.status(403).json("operation can only be done by the Admin")
    }
}) 
// get user stat
router.get("/stats", async(req, res)=>{
    //to get the record of last year
    const today=new Date();
    const lastYear=today.setFullYear(today.setFullYear() -1);
    //get months array
    const monthsArray=[
        "january", "February", "April", "May", "june",
        "August", "September", "October", "November",
        "December"
    ];
    try{
 //group users monthly
 const Data=await User.aggregate([
    {$project:
        {month:
            {$month:"$createdAt"} }},
    {$group:
        {_id:"$month",
            total:{$sum:1}},
}
]);
return res.status(200).json(Data);
    }catch(err){
        return res.status(500).json(err)
    }
   
})

module.exports=router;