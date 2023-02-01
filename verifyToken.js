const jwt=require("jsonwebtoken");
function verify(req, res, next){
const authHeader=req.headers.token;
if(authHeader){
  const token=authHeader.split(" ")[1]
  //verify the token
  jwt.verify(token, process.env.SECRET_KEY,(err, user1)=>{
    if(err){
return res.status(401).json("Token is not valid")
    }else{
req.user=user1;
/* let our user via req.user=user1, which is a variable that 
represents our _id and isAdmin in the auth.js */
next();
    }
  })
}else{
    return res.status(401).json("you are not authenticated")
}
}
module.exports=verify;