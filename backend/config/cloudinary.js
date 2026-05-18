const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Le damos tus llaves a Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuramos dónde y cómo se van a guardar las fotos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avicare_fotos', // Se creará esta carpeta en tu nube
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

// 3. Creamos el middleware que interceptará la foto
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };