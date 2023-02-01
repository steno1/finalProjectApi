const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
const cors=require("cors");
const corsOptions={
    origin:"*",
    Credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))

//auth router
const authRoute=require("./routes/auth.js")
const userRoute=require("./routes/users.js")
const moviesRoute=require("./routes/movies.js")
const listRoute=require("./routes/list.js")

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {

})
  .then(() => console.log('Connected to mongodb!'));
 app.use(express.json()); 
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/lists", listRoute);
app.use(cors());


app.listen(8800, ()=>{
    console.log("server listening to port 8800")
})