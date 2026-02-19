const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const app = express();

const listingRoutes = require("./routes/listings");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/hotelBooking");
}

main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("This is home for airBNB");
});

app.use("/listings", listingRoutes);

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
