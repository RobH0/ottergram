import {v2 as cloudinary} from 'cloudinary';

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.IMG_CLOUD_NAME,
    api_key: process.env.IMG_API_KEY,
    api_secret: process.env.IMG_API_SECRET
});

module.exports = cloudinary;