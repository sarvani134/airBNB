const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../ExpressError");
const HotelData=require("../models/data.js")
const {isOwner,isLoggedIn}=require("./middleware.js")
const controller=require("../controller/listing")
const reviewController=require("../controller/review")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
// const addData=async(req,res)=>{
//   await Listing.deleteMany({})
//   HotelData.data=HotelData.data.map((obj)=>({
//     ...obj,
//     owner:'699a975d969f78e82df0b770'
//   }))
//   await Listing.insertMany(HotelData.data)
// }
// addData()

router.get("/", asyncWrap(controller.show));



router.get("/book/:id", isLoggedIn,asyncWrap(controller.bookId));


router.post("/book",isLoggedIn, asyncWrap(controller.book));


router.get("/sort", asyncWrap(controller.sort));



router.get("/create",isLoggedIn,controller.createListing);


// router.post("/create",isLoggedIn, asyncWrap(controller.create));
router.post("/create",upload.single('urlImage'),asyncWrap(controller.create))

router.get("/delete",isLoggedIn,isOwner, controller.deleteFile);

router.delete("/delete", asyncWrap(controller.deleteListing));



router.get("/edit",isLoggedIn,isOwner, controller.edit);


router.get("/edit/:id",isLoggedIn,isOwner, asyncWrap(controller.editId));


router.patch("/edit/:id",isLoggedIn,isOwner, upload.single("urlImage"),asyncWrap(controller.editListing));



router.get("/:id", asyncWrap(controller.showId));


router.post("/:id/reviews",isLoggedIn, asyncWrap(reviewController.createReview));

router.post("/:id/reviews/:reviewId/delete", isLoggedIn, asyncWrap(reviewController.deleteReview));
// router.delete("/:id/reviews/:reviewId", isLoggedIn,asyncWrap(async (req, res) => {

//   let { id, reviewId } = req.params;

//   await Review.findByIdAndDelete(reviewId);

//   await Listing.findByIdAndUpdate(id, {
//     $pull: { reviews: reviewId }
//   });

//   res.redirect(`/listings/${id}`);

// }));




module.exports =router;
