const cloudinary = require('cloudinary').v2;
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travelSpot_DEV',
    allowed_formats: ['png', 'jpeg', 'jpg', 'pdf'],   // ← note: allowed_formats (with underscore)
  },
});

module.exports = { storage, cloudinary };