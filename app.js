const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const ejsMate=require("ejs-mate")
const app=express()

const initData=require("./models/data")
const Listing=require("./models/listing")
const methodOverride=require("method-override")
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs", ejsMate);  
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))

app.listen(8080,()=>{
console.log("listening from port 8080")
})
async function main(){
    await mongoose.connect("mongodb://localhost:27017/hotelBooking")
}
main()
.then((res)=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
    
})
app.get("/",(req,res)=>{
    res.send("This is home for airBNB ")
    
})
app.get("/listings", async(req,res)=>{

   let lists= await Listing.find({})
   
        res.render("index",{listings:lists})
})

app.get("/listings/book/:id",async(req,res)=>{
    let {id}=req.params;
    

    res.render("book",{listId:id})
})
app.post("/listings/book",async(req,res)=>{

    try{
        let {id}=req.body;
        let listing=await Listing.findByIdAndUpdate(id,{$inc:{bookingCount:1}})
        res.redirect("/listings")
    }
    catch(err){
        console.log(err)
    }

})
app.get("/listings/sort", async (req, res) => {
    try {
        let sortOption = {};

        if (req.query.sort === "price_asc") {
            sortOption.price = 1;   // Ascending
        } 
        else if (req.query.sort === "price_desc") {
            sortOption.price = -1;  // Descending
        }
        else if (req.query.sort==='more_popular'){
            sortOption.bookingCount=-1;
        }
       

        const listings = await Listing.find().sort(sortOption);

        res.render("index", { listings });

    } catch (err) {
        console.log(err);
    }
});

app.get("/listings/create",(req,res)=>{
    res.render("create")
})
app.post("/listings/create",async (req,res)=>{
    try{
    const { title, description, location, country, price, urlLink } = req.body;

        const newListing = new Listing({
            title,
            description,
            location,
            country,
            price,
            image: {
                filename: "Listing Image",
                url: urlLink || undefined   // if empty → use default
            }
           
        });
         await newListing.save();

        res.redirect("/listings");

    }
        catch(err){
            console.log(err);
            
        }

})

// app.patch("/listings/edit",async (res,res){
        // try{

        // }
        // catch(err){

        // }

// })
app.delete("/listings/delete",async (req,res)=>{
   try{
     let {id}=req.body;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
   }
   catch(err){
    console.log(err)
   }
})
app.get("/listings/edit",  (req, res) => {
    let { id } = req.query;

   
    if (!id) {
        return res.render("editing");
    }

    res.redirect(`/listings/edit/${id}`);
});

app.get("/listings/edit/:id",async (req,res)=>{
    let {id}=req.params;
    
    let listings=await Listing.findById(id)
    
        res.render("edit",{listings})

})

app.patch("/listings/edit",async(req,res)=>{
   let { id, title, description, price, location, country,imageUrl,discount } = req.body;

let image = {
  filename: "listingimage",
  url: imageUrl
};

await Listing.findByIdAndUpdate(
  id,
  {
    title,
    description,
   price: parseInt(price),
    location,
    country,
    image,
    discount:parseInt(discount)
  },
  { new: true }
);
res.redirect("/listings")
})
app.get("/listings/:id",async (req,res)=>{
   try{
     let {id}=req.params;
     
    let listings=await Listing.findById(id)
    
    
    res.render("show",{listings})

   }
   catch(err){
    console.log(err)
   }
})
// app.patch("/listings/edit",async (req,res)=>{


// })
// 

// async function init (){
//     await Listing.deleteMany({})
// await Listing.insertMany(initData.data)
// }
// init()