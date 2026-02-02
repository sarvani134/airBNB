const express=require("express")
const mongoose=require("mongoose")

express.listen(8080,()=>{
console.log("listening from port 8080")
})
async function main(){
    await mongoose.connect("mongodb://localhost:27017/piyush")
}
main()
.then((res)=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
    
})
app.get("/",(req,res)=>{
    console.log("airBnb ");
    
})