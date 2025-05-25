import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary com as credenciais do .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Faz upload de um vídeo para o Cloudinary
 * @param {string} videoPath - Caminho do vídeo (pode ser um arquivo local ou URL)
 * @param {string} experienceId - ID da experiência para organizar os vídeos
 * @returns {Promise<Object>} - Objeto com informações do vídeo enviado
 */
export const uploadVideo = async (videoPath, experienceId) => {
  try {
    // Fazer upload do vídeo para o Cloudinary
    const result = await cloudinary.uploader.upload(videoPath, {
      resource_type: 'video',
      folder: 'mothers-day-videos',
      public_id: `experience-${experienceId}`,
      overwrite: true,
      format: 'mp4',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('Vídeo enviado com sucesso:', result);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Erro ao fazer upload do vídeo:', error);
    throw error;
  }
};

/**
 * Gera uma URL assinada para download seguro do vídeo
 * @param {string} publicId - ID público do vídeo no Cloudinary
 * @param {string} fileName - Nome do arquivo para download
 * @returns {string} - URL assinada para download
 */
export const generateVideoDownloadUrl = (publicId, fileName) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const expiryTime = timestamp + 3600; // URL válida por 1 hora
  
  // Gerar URL assinada para download
  const url = cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'private',
    attachment: fileName,
    expires_at: expiryTime,
    sign_url: true,
    format: 'mp4',
  });
  
  return url;
};

/**
 * Obtém informações de um vídeo no Cloudinary
 * @param {string} publicId - ID público do vídeo no Cloudinary
 * @returns {Promise<Object>} - Objeto com informações do vídeo
 */
export const getVideoInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video',
    });
    
    return result;
  } catch (error) {
    console.error('Erro ao obter informações do vídeo:', error);
    throw error;
  }
};

/**
 * Exclui um vídeo do Cloudinary
 * @param {string} publicId - ID público do vídeo no Cloudinary
 * @returns {Promise<Object>} - Resultado da operação de exclusão
 */
export const deleteVideo = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });
    
    return result;
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    throw error;
  }
};

export default cloudinary;
