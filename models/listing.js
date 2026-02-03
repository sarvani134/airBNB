const  mongoose = require("mongoose");
const Schema=mongoose.Schema
let listingSchema=new Schema({
    title:String,
    description:{
        type:String
    },
    price:{
        type:Number
    },
    image: {
    filename: {
        type: String
    },
    url: {
        type: String,
        default:
            "https://static.vecteezy.com/system/resources/thumbnails/006/676/753/small/tranquil-beach-scene-couple-chairs-umbrella-exotic-tropical-beach-landscape-destination-for-background-or-wallpaper-design-of-romantic-summer-vacation-holiday-concept-photo.jpg"
    }
},
    location:{
        type:String
    },
    country:{
        type:String
    },
})
let Listing=mongoose.model("Listing",listingSchema)
 module.exports=Listing