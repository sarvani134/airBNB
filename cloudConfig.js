const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_APIKEY,
    api_secret:process.env.CLOUD_API_SECRET,
    

})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travelSpot_DEV',
   allowedFormats:["png","jpeg","jpg","pdf"],
   
  },
});
module.exports={storage,cloudinary}