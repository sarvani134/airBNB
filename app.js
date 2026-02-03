const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const app=express()
const initData=require("./models/data")
const Listing=require("./models/listing")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
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
    res.send("airBnb")
    
})
app.get("/listings", async(req,res)=>{

   let lists= await Listing.find({})
   
        res.render("index",{listings:lists})
})
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
app.get("/listings/:id",async (req,res)=>{
   try{
     let {id}=req.params;
    let listings=await Listing.findById(id)
    console.log(listings)
    res.render("show",{listings})

   }
   catch(err){
    console.log(err)
   }
})
// 

// async function init (){
//     await Listing.deleteMany({})
// await Listing.insertMany(initData.data)
// }
// init()