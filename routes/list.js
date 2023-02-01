const router=require("express").Router();
const List=require("../model/List.js")
const verify=require("../verifyToken.js")

//create
router.post("/", verify, async(req, res)=>{
    if(req.user.isAdmin){
        const newList=new List(req.body)
try{
const savedList= await newList.save();
return res.status(200).json(savedList);
}catch(err){
    return res.status(500).json(err)
}
    }else{
        return res.status(403).json("you are not allowed")
    }
})
//delete
router.delete("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){
try{
await List.findByIdAndDelete(req.params.id);
return res.status(200).json("The list has been deleted")
}catch(err){
return res.status(500).json(err)
}
    }else{
        return res.status(403).json("you are not allowed")
    }
});
//get all
router.get("/",verify, async (req, res)=>{
    const typeQuery=req.query.type;
    const genreQuery=req.query.genre;
    let listArray=[]
    
    try{
if(typeQuery){
if(genreQuery){
listArray=await List.aggregate([
    //home page with series or movies and genre
    {$sample:{size:10}},
    {$match:{type:typeQuery, genre:genreQuery}}
])
}else{
 //series or movies page
 listArray=await List.aggregate([
    {$sample:{size:10}},
    {$match:{type:typeQuery}}
 ])   
}
}else{
    //home page, without click series or movies
listArray=await List.aggregate([
    {$sample:{size:10}}
])
}
return res.status(200).json(listArray);

    }catch(err){
        return res.status(500).json(err)
    }
})

module.exports=router