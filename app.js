if(process.env.NODE_ENV!='production'){
require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash=require("connect-flash")
const app = express();
const session=require("express-session")
const listingRoutes = require("./routes/listings.js");
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
const userRouter=require("./routes/user")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// session
let sessionOptions={secret:"mySecret",
    resave:false,
    saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
  }
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash())
async function main() {
  await mongoose.connect("mongodb://localhost:27017/hotelBooking");
}

main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
 res.redirect("/listings")
});
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
 res.locals.error = req.flash("error");
 res.locals.currUser = req.user;
  next()
})
app.get("/demo",async(req,res)=>{
  let fakeUser=new User({email:'student@gmail.com',username:'delta-student'})
  
  let newUser=await User.register(fakeUser,'helloworld');
  res.send(newUser)
})

app.use("/listings", listingRoutes);
app.use("/user",userRouter)

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
