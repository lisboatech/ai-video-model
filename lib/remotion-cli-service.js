'use server'

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v2 as cloudinary } from 'cloudinary';

// Promisificar exec
const execAsync = promisify(exec);

// Configurar o Cloudinary
// Extrair as credenciais da URL do Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'de0abarv5';
let apiKey = '';
let apiSecret = '';

// Extrair API key e secret da URL do Cloudinary
if (cloudinaryUrl) {
  const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);
  if (match) {
    apiKey = match[1];
    apiSecret = match[2];
    cloudName = match[3];
  }
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Renderiza um vídeo usando o Remotion CLI e faz upload para o Cloudinary
 *
 * @param {string} experienceId - ID da experiência
 * @param {Object} videoInfo - Informações do vídeo
 * @returns {Promise<Object>} - Resultado do upload para o Cloudinary
 */
export async function renderVideo(experienceId, videoInfo) {
  try {
    console.log('Iniciando renderização do vídeo com Remotion CLI...');

    // Criar diretório temporário para o vídeo
    const outputDir = path.join(os.tmpdir(), 'mothers-day-videos');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFileName = `experience-${experienceId}-${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    console.log('Caminho de saída:', outputPath);

    // Salvar as informações do vídeo em um arquivo temporário
    const videoInfoPath = path.join(outputDir, `video-info-${experienceId}.json`);

    // Garantir que o gifNumber seja um número
    let gifNumber = 1;
    if (videoInfo.voice && videoInfo.voice.gifNumber) {
      gifNumber = Number(videoInfo.voice.gifNumber);
    }

    // Preparar os props para a renderização
    const inputProps = {
      message: videoInfo.script || "Feliz Dia das Mães!",
      images: videoInfo.assets || [],
      audioUrl: videoInfo.voiceUrl || null,
      visualizationOptions: {
        color: '#ff0000',
        sphereColor: videoInfo.voice?.sphereColor || 'love',
        gifNumber: gifNumber
      },
      backgroundMusic: videoInfo.voice?.backgroundMusic || 'emocional'
    };

    // Log detalhado para depuração
    console.log('Dados completos de voice:', JSON.stringify(videoInfo.voice));
    console.log('gifNumber passado para renderização:', inputProps.visualizationOptions.gifNumber, 'tipo:', typeof inputProps.visualizationOptions.gifNumber);

    console.log('Dados para renderização:');
    console.log('- Mensagem:', inputProps.message ? inputProps.message.substring(0, 50) + '...' : 'Não fornecido');
    console.log('- Imagens:', JSON.stringify(inputProps.images));
    console.log('- Áudio:', inputProps.audioUrl);
    console.log('- Música de fundo:', inputProps.backgroundMusic);
    console.log('- GIF número:', inputProps.visualizationOptions.gifNumber);
    console.log('- Dados completos de visualizationOptions:', JSON.stringify(inputProps.visualizationOptions));
    console.log('- Dados originais de voice:', JSON.stringify(videoInfo.voice));

    // Verificar se os dados são válidos
    if (!inputProps.message) {
      console.warn('Aviso: Mensagem não fornecida para renderização');
    }

    if (!inputProps.images || inputProps.images.length === 0) {
      console.error('Erro: Nenhuma imagem fornecida para renderização');
      throw new Error('Nenhuma imagem fornecida para renderização');
    }

    if (!inputProps.audioUrl) {
      console.error('Erro: URL do áudio não fornecida para renderização');
      throw new Error('URL do áudio não fornecida para renderização');
    }

    // Verificar se as URLs são válidas
    const invalidImages = inputProps.images.filter(url => typeof url !== 'string' || !url.startsWith('http'));
    if (invalidImages.length > 0) {
      console.error('Erro: URLs de imagens inválidas:', invalidImages);
      throw new Error('URLs de imagens inválidas fornecidas para renderização');
    }

    if (typeof inputProps.audioUrl !== 'string' || !inputProps.audioUrl.startsWith('http')) {
      console.error('Erro: URL do áudio inválida:', inputProps.audioUrl);
      throw new Error('URL do áudio inválida fornecida para renderização');
    }

    fs.writeFileSync(videoInfoPath, JSON.stringify(inputProps, null, 2));

    // Caminho para o arquivo de entrada do Remotion
    const entryPoint = path.join(process.cwd(), 'remotion', 'index.jsx');

    // Comando para renderizar o vídeo usando o CLI do Remotion (com configurações otimizadas)
    // Reduzir o fps para 15 para corrigir o problema de velocidade do GIF
    const command = `npx remotion render "${entryPoint}" MothersDay --props=${videoInfoPath} --output="${outputPath}" --codec=h264 --concurrency=12 --jpeg-quality=85 --crf=28 --pixel-format=yuv420p --fps=15`;

    console.log('Executando comando:', command);

    try {
      // Executar o comando
      const { stdout, stderr } = await execAsync(command);

      console.log('Saída do comando:', stdout);
      if (stderr) {
        console.error('Erro do comando:', stderr);
      }
    } catch (execError) {
      console.error('Erro ao executar comando:', execError);
      throw execError;
    }

    // Verificar se o arquivo foi criado
    if (!fs.existsSync(outputPath)) {
      throw new Error('O arquivo de vídeo não foi criado');
    }

    console.log('Vídeo renderizado com sucesso:', outputPath);

    // Fazer upload do vídeo para o Cloudinary
    console.log('Fazendo upload para o Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video',
      folder: 'mothers-day-videos',
      public_id: `experience-${experienceId}`,
      overwrite: true,
      format: 'mp4',
    });

    console.log('Upload para o Cloudinary concluído:', uploadResult.secure_url);

    // Limpar o arquivo temporário
    try {
      fs.unlinkSync(outputPath);
      fs.unlinkSync(videoInfoPath);
      console.log('Arquivos temporários removidos');
    } catch (cleanupError) {
      console.warn('Aviso: Não foi possível remover arquivos temporários:', cleanupError);
    }

    // Retornar informações do vídeo
    return {
      success: true,
      message: 'Vídeo processado com sucesso',
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      videoInfo: {
        format: uploadResult.format,
        duration: uploadResult.duration,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      }
    };
  } catch (error) {
    console.error('Erro ao renderizar vídeo:', error);
    throw error;
  }
}
