const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn}=require("./middleware.js");
const Listing = require("../models/listing.js");
router.get("/signup",(req,res)=>{
    res.render("signupForm",{err:""})
})

// let {email,password,username}=req.body
// let newUser=new User({username,email})
// let regUser=await User.register()
router.post("/signup",async(req,res)=>{
    try{
        let {username,password,email}=req.body;
    let newUser=new User({username,email})
    const regUser=await User.register(newUser,password)
    console.log(regUser)
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to airBNB clone")
    res.redirect("/listings")

    })
   
    }
    catch(err){
       if(err.name==='UserExistsError'){
        req.flash("error","username already exists try put a new name")
     
        res.redirect("/user/signup")
       }
    // res.send(err)
  
    }

})

router.get("/login", (req, res) => {
    res.render("loginForm");
});


router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: "Invalid username or password"
  }),
  (req, res) => {
    req.flash("success", "Successfully logged in");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","successfully logged out")
        res.redirect("/listings")
    })
})
// passport.authenticate("local",{failureRedirect:"/user/login"})
module.exports=router;