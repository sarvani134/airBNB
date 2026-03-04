const Listing = require("../models/listing");
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
module.exports.show=async (req, res) => {

  let lists = await Listing.find({});
  res.render("index", { listings: lists });

}
module.exports.showId=async (req, res) => {

  let { id } = req.params;

  let listings = await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");

  res.render("show", { listings });

}
module.exports.bookId=async (req, res) => {

  let { id } = req.params;
  let listing = await Listing.findById(id);

  res.render("book", { listing });

}
module.exports.book=async (req, res) => {

  let { id } = req.body;

  await Listing.findByIdAndUpdate(id, {
    $inc: { bookingCount: 1 }
  });

  res.redirect("/listings");

}
module.exports.sort = async (req, res) => {

  const sortType = req.query.sort;

  let pipeline = [];

  pipeline.push({
    $addFields: {
      finalPrice: {
        $cond: {
          if: { $gt: ["$discount", 0] },
          then: {
            $subtract: [
              "$price",
              { $multiply: ["$price", { $divide: ["$discount", 100] }] }
            ]
          },
          else: "$price"
        }
      }
    }
  });

  // Sorting logic
  if (sortType === "price_asc") {
    pipeline.push({ $sort: { finalPrice: 1 } });
  }

  else if (sortType === "price_desc") {
    pipeline.push({ $sort: { finalPrice: -1 } });
  }

  else if (sortType === "more_popular") {
    pipeline.push({ $sort: { bookingCount: -1 } });
  }

  else if (sortType === "more_discount") {
    pipeline.push({ $sort: { discount: -1 } });
  }

  // Run aggregation
  const listings = await Listing.aggregate(pipeline);

  res.render("index", { listings });
};
module.exports.locate=async(req,res)=>{
  try{
    let {location}=req.body;
  let listings=await Listing.find(
    {location:{
      $regex:location,
      $options:"i"
    }}
  )
  if(listings.length==0){
    return res.send(" Sorry !Location not found ")
  }
  res.render("index",{listings})

  }
  catch(err){
    res.send("error")
  }
}
module.exports.create=async (req, res) => {

  const { title, description, location, country, price } = req.body;
  const {filename,path}=req.file

  const newListing = new Listing({
    title,
    description,
    location,
    country,
   price: parseInt(price),
    image: {
      filename: filename,
      url: path
    }
  });
  newListing.owner=req.user._id;
     
  await newListing.save();
     req.flash("success","New Listing Created")
  res.redirect("/listings");

}
module.exports.createListing= (req, res) => {
 if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl
    req.flash("error","you must be logged in to create a listing")
    return res.redirect("/user/login")
 }
  res.render("create");
}
module.exports.deleteFile=(req, res) => {
  res.render("delete");
}
module.exports.deleteListing=async (req, res) => {

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
}
module.exports.edit=(req, res) => {

  let { id } = req.query;

  if (!id) {
    return res.render("editing");
  }

  res.redirect(`/listings/edit/${id}`);

}
module.exports.editId=async (req, res, next) => {

  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    return next(new ExpressError(404, "Id not found"));
  }

  res.render("edit", { listings: listing });

}
module.exports.editListing = async (req, res) => {

  const {
    id,
    title,
    description,
    price,
    location,
    country,
    discount
  } = req.body;

  // 1️⃣ Get existing listing
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // 2️⃣ Prepare update object
  let updateData = {
    title,
    description,
    price: parseInt(price),
    location,
    country,
    discount: parseInt(discount),

    // Default = old image
    image: listing.image
  };

  // 3️⃣ If new image uploaded → replace
  if (req.file) {
    const { filename, path } = req.file;

    updateData.image = {
      filename,
      url: path
    };
  }

  // 4️⃣ Update DB
  await Listing.findByIdAndUpdate(id, updateData);

  req.flash("success", "Listing updated successfully");

  res.redirect(`/listings/${id}`);
};
