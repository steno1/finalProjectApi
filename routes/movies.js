const router=require("express").Router();
const jwt=require("jsonwebtoken");
const Movies=require("../model/Movie.js")
const verify=require("../verifyToken.js")

//create
router.post("/", verify, async (req, res)=>{
    if(req.user.isAdmin){
    // creating a new movie
    const newMovie= new Movies(req.body);
    try{
//save new movie
const recentMovie=await newMovie.save();
return res.status(201).json(recentMovie)
    }catch(err){
        return res.status(500).json(err)
    }
}else{
    return res.status(403).json("you are not permitted to perform this operation")
}
});
//update
router.put("/:id", verify, async (req, res)=>{
    if(req.user.isAdmin){
try{
updatedMovie=await Movies.findByIdAndUpdate(req.params.id, {$set:req.body},
    {new:true});
    return res.status(200).json(updatedMovie);
}catch(err){
    return res.status(500).json(err)
}
    }else{
        return res.status(403).json("you are not allowed to perform this operation")
    }
});

//delete
router.put("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){
try{
await Movies.findByIdAndDelete(req.params.id);
return res.status(200).json("The Movie has successfully been deleted")
}catch(err){
    return res.status(500).json(err)
}
    }else{
        return res.status(403).json("you are not allowed")
    }
})
//get
router.get("/find/:id", verify, async(req, res)=>{
    try{
const newMovies=await Movies.findById(req.params.id);
return res.status(200).json(newMovies);    
    }catch(err){
        return res.status(500).json(err)
    }
})
//get random movies
router.get("/random", verify, async(req, res)=>{
    const type=req.query.type;
    let movie;
    try{
     if(type==="series"){
 movie=await Movies.aggregate([
    {$match:{isSeries:true}},
    {$sample:{size:1}}
])

     }else{
        movie=await Movies.aggregate([
            {$match:{isSeries:false}},
            {$sample:{size:1}}
        ])
        
     };
     return res.status(200).json(movie)
            }catch(err){
                return res.status(500).json(err)
            }
});
//get all
router.get("/",verify, async (req, res)=>{
if(req.user.isAdmin){
try{
const allMovies=await Movies.find();
return res.status(200).json(allMovies.reverse());
}catch(err){
    return res.status(500).json(err)
}
}else{
    return res.status(403).json("you are not allowed")
}
})
module.exports=router