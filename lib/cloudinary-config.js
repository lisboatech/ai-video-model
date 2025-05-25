import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary com as credenciais do .env.local
cloudinary.config({
  cloud_name: 'de0abarv5',
  api_key: '745132751591483',
  api_secret: 'rax7kfKhu-pThW8KECtn6JfCTtU',
});

export default cloudinary;
