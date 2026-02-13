const express=require("express")
const app=express()
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.listen(8000,()=>{
console.log("listening from port 8000")
})
let count=0;
// app.use((req,res,next)=>{
//     count++;
//     console.log(`this is middleware clicked  ${count}`);
//     console.log(req.path,req.method)
//     next();
// })
app.use("/random",(req,res,next)=>{
    console.log("random")
    next();
})
app.use("/api",(req,res,next)=>{
    let {token}=req.query;
    console.log(token)
    if(token=='accessgiven'){
        return next();
    }
    res.render("accessDenied")
})
app.get("/err",(req,res)=>{
    abcd=abcd;
})
app.use((err,req,res,next)=>{
    console.log("@@@@@@@@@@@@@@@@@@@@@ Error @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    // res.send("something went wrong")
    next();
})

app.get("/api",(req,res)=>[
    res.send("data")
])
app.get("/",(req,res)=>{
res.send("Home page for middle ware")
})
app.get("/random",(req,res)=>{
    res.send("random page")
})
// app.use((req,res)=>{
//     res.render("pageNotFound")
// })