const express=require("express")
const posts=require("./routes/posts.js")

const app=express()
app.use(express.json())
app.use("/posts",posts)
app.get("/",(req,res)=>{
    res.send("home")
})
app.listen(8090,()=>{
    console.log("listening from port 8090");
    
})
