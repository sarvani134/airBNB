const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../ExpressError");
const HotelData=require("../models/data.js")
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
const addData=async(req,res)=>{
  await Listing.deleteMany({})
  HotelData.data=HotelData.data.map((obj)=>({
    ...obj,
    owner:'699a975d969f78e82df0b770'
  }))
  await Listing.insertMany(HotelData.data)
}
addData()

router.get("/", asyncWrap(async (req, res) => {

  let lists = await Listing.find({});
  res.render("index", { listings: lists });

}));



router.get("/book/:id", asyncWrap(async (req, res) => {

  let { id } = req.params;
  let listing = await Listing.findById(id);

  res.render("book", { listing });

}));


router.post("/book", asyncWrap(async (req, res) => {

  let { id } = req.body;

  await Listing.findByIdAndUpdate(id, {
    $inc: { bookingCount: 1 }
  });

  res.redirect("/listings");

}));


router.get("/sort", asyncWrap(async (req, res) => {

  let sortOption = {};

  if (req.query.sort === "price_asc") {
    sortOption.price = 1;
  }
  else if (req.query.sort === "price_desc") {
    sortOption.price = -1;
  }
  else if (req.query.sort === "more_popular") {
    sortOption.bookingCount = -1;
  }

  const listings = await Listing.find().sort(sortOption);

  res.render("index", { listings });

}));



router.get("/create", (req, res) => {
 if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl
    req.flash("error","you must be logged in to create a listing")
    return res.redirect("/user/login")
 }
  res.render("create");
});


router.post("/create", asyncWrap(async (req, res) => {

  const { title, description, location, country, price, urlLink } = req.body;

  const newListing = new Listing({
    title,
    description,
    location,
    country,
    price,
    image: {
      filename: "Listing Image",
      url: urlLink || undefined
    }
  });
     
  await newListing.save();
     req.flash("success","New Listing Created")
  res.redirect("/listings");

}));

router.get("/delete", (req, res) => {
  res.render("delete");
});
router.delete("/delete", asyncWrap(async (req, res) => {

  try{
    let { id } = req.body;

  if (!id) {
    
    return   res.redirect("/listings/delete");
  }

  await Listing.findByIdAndDelete(id);

  res.redirect("/listings");

  }
  catch(err){
   console.log(err)
   req.flash("error","enter a valid ID")
    res.redirect("/listings/delete")
  }
}));



router.get("/edit", (req, res) => {

  let { id } = req.query;

  if (!id) {
    return res.render("editing");
  }

  res.redirect(`/listings/edit/${id}`);

});


router.get("/edit/:id", asyncWrap(async (req, res, next) => {

  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    return next(new ExpressError(404, "Id not found"));
  }

  res.render("edit", { listings: listing });

}));


router.patch("/edit", asyncWrap(async (req, res) => {

  let {
    id,
    title,
    description,
    price,
    location,
    country,
    imageUrl,
    discount
  } = req.body;

  let image = {
    filename: "listingimage",
    url: imageUrl
  };

  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price: parseInt(price),
    location,
    country,
    image,
    discount: parseInt(discount)
  });

  res.redirect("/listings");

}));



router.get("/:id", asyncWrap(async (req, res) => {

  let { id } = req.params;

  let listings = await Listing.findById(id)
    .populate("reviews");

  res.render("show", { listings });

}));


router.post("/:id/reviews", asyncWrap(async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findById(id);

  let newReview = new Review(req.body.review);

  await newReview.save();

  listing.reviews.push(newReview);

  await listing.save();

  res.redirect(`/listings/${id}`);

}));


router.delete("/:id/reviews/:reviewId", asyncWrap(async (req, res) => {

  let { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  res.redirect(`/listings/${id}`);

}));




module.exports =router;
