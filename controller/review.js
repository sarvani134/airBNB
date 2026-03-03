const Listing = require("../models/listing");
const Review = require("../models/reviews");
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
module.exports.createReview=async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findById(id);

  // let newReview = new Review(req.body.review);
let newReview = new Review({
  ...req.body.review,
  author: req.user._id
});
  await newReview.save();

  listing.reviews.push(newReview);

  await listing.save();

  res.redirect(`/listings/${id}`);

}
module.exports.deleteReview=async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  res.redirect(`/listings/${id}`);
}
