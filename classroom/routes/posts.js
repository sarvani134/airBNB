const express=require("express")
const router=express.Router()

router.get("/",(req,res)=>{
    res.send("home for posts")
})
router.get("/:id",(req,res)=>{
    res.send("id for get")
})
router.post("/:id",(req,res)=>{
    res.send("post on id ")
})
module.exports=router;