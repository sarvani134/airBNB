const Listing=require("../models/listing")
module.exports.saveRedirectUrl=((req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
 
  next()
})
// authorization
module.exports.isOwner = async(req,res,next)=>{
    const id = req.params.id || req.body.id;
   
 
   let listing=await Listing.findById(id)
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you dont have access to modify");
    return res.redirect(`/listings/${id}`)
  }

  next()
}
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in first");
    return res.redirect("/user/login");
  }

  next();
};
