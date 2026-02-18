const  mongoose = require("mongoose");
const Schema=mongoose.Schema
const Review=require("./reviews")
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
    bookingCount:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})
listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        console.log(listing);
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }

})
let Listing=mongoose.model("Listing",listingSchema)
 module.exports=Listing