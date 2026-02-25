const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const passport = require("passport");
router.get("/signup",(req,res)=>{
    res.render("signupForm",{err:""})
})
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


router.post("/login",passport.authenticate("local",{failureRedirect:'/user/login',failureFlash:"Invalid username or password"}),async(req,res)=>{
        req.flash("success","successfully logged In")
      res.redirect("/listings")
})
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