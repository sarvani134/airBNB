const express=require("express")
const posts=require("./routes/posts.js")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const flash=require("connect-flash")
const app=express()
const path=require("path")
// app.use(cookieParser("secret-code"))
let sessionOptions={secret:"mySecret",
    resave:false,
    saveUninitialized:true}
app.use(session(sessionOptions))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(flash())
app.get("/test",(req,res)=>{
    res.send("tested successfully")
})
app.get("/register",(req,res)=>{
    let {name='anonymous'}=req.query;
    req.session.name=name;
    req.flash("success","user registered successfully")
    console.log(req.session.name);
   res.redirect("/hello")

})

app.get("/hello",(req,res)=>{
   res.render("show",{name:req.session.name})
})
// app.get("/reqCount",(req,res)=>{
//         if(req.session.count){
//             req.session.count++;
//         }
//         else{
//             req.session.count=1;
//         }
//     res.send(`you sent a req ${req.session.count} times`)
// })
app.get("/",(req,res)=>{
    res.send("home for classroom")
})
app.listen(8090,()=>{
    console.log("listening from port 8090");
    
})


// app.use(express.json())
// app.use("/posts",posts)
// app.get("/getCookies",(req,res)=>{
//     res.cookie("greet","hello sara  nice")
//     res.send("cookie sent")
// })
// app.get("/signedCookie",(req,res)=>{
//     res.cookie("name","millie",{signed:true});
//     res.send("signed cookie sent")
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verification done")
// })
// app.get("/greet",(req,res)=>{
//     let {name='anonymous'}=req.signedCookies;
//     res.send(`Hello ${name}`)
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("home")
// })
