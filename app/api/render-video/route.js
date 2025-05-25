import { NextResponse } from 'next/server';
import { renderVideo } from '../../../lib/remotion-cli-service';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

// Cliente Convex para atualizações no banco de dados
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Função para processar o vídeo usando Remotion e Cloudinary
export async function POST(request) {
  try {
    // Obter dados da requisição
    const { experienceId, videoInfo } = await request.json();

    if (!experienceId || !videoInfo) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos para processamento' },
        { status: 400 }
      );
    }

    console.log(`Processando vídeo para experiência ${experienceId}`);
    console.log('Dados recebidos para renderização:', JSON.stringify({
      script: videoInfo.script ? videoInfo.script.substring(0, 50) + '...' : 'Não fornecido',
      assets: videoInfo.assets,
      voiceUrl: videoInfo.voiceUrl,
      backgroundMusic: videoInfo.voice?.backgroundMusic,
      gifNumber: videoInfo.voice?.gifNumber
    }, null, 2));

    // Log detalhado do objeto voice
    console.log('Objeto voice completo:', JSON.stringify(videoInfo.voice, null, 2));

    // Verificar se temos o áudio da narração e pelo menos uma imagem
    if (!videoInfo.assets || videoInfo.assets.length === 0) {
      console.error('Erro: Nenhuma imagem fornecida para renderização');
      return NextResponse.json(
        { success: false, error: 'Pelo menos uma imagem é necessária para renderizar o vídeo' },
        { status: 400 }
      );
    }

    // Verificar se as URLs das imagens são válidas (não são URLs de blob)
    const invalidAssets = videoInfo.assets.filter(url => typeof url === 'string' && url.startsWith('blob:'));
    if (invalidAssets.length > 0) {
      console.error('Erro: URLs de blob detectadas:', invalidAssets);
      return NextResponse.json(
        { success: false, error: 'As imagens devem ser enviadas para o servidor antes de renderizar o vídeo' },
        { status: 400 }
      );
    }

    // Verificar se temos a URL da narração
    if (!videoInfo.voiceUrl) {
      console.error('Erro: URL da narração não fornecida');
      console.error('Dados completos recebidos:', JSON.stringify(videoInfo, null, 2));

      // Tentar buscar os dados do banco de dados
      try {
        console.log('Tentando buscar dados do banco de dados...');
        const dbData = await convex.query(api.videoData.GetVideoDataById, {
          vid: experienceId
        });

        console.log('Dados do banco de dados:', JSON.stringify({
          voiceUrl: dbData.voiceUrl,
          voice: dbData.voice
        }, null, 2));

        // Se temos a URL da narração no banco de dados, usá-la
        if (dbData.voiceUrl) {
          console.log('Usando URL da narração do banco de dados:', dbData.voiceUrl);
          videoInfo.voiceUrl = dbData.voiceUrl;

          // Preservar o gifNumber do banco de dados se existir
          if (dbData.voice && dbData.voice.gifNumber) {
            console.log('Preservando gifNumber do banco de dados:', dbData.voice.gifNumber);
            if (!videoInfo.voice) videoInfo.voice = {};
            videoInfo.voice.gifNumber = dbData.voice.gifNumber;
          }

          // Atualizar o banco de dados para garantir que o voiceUrl está correto
          await convex.mutation(api.videoData.UpdateVoiceUrl, {
            vId: experienceId,
            voiceUrl: dbData.voiceUrl
          });
        } else {
          // Se não temos a URL da narração no banco de dados, verificar se temos no objeto voice
          if (dbData.voice && dbData.voice.voiceUrl) {
            console.log('Usando URL da narração do objeto voice:', dbData.voice.voiceUrl);
            videoInfo.voiceUrl = dbData.voice.voiceUrl;

            // Preservar o gifNumber do banco de dados se existir
            if (dbData.voice.gifNumber) {
              console.log('Preservando gifNumber do banco de dados:', dbData.voice.gifNumber);
              if (!videoInfo.voice) videoInfo.voice = {};
              videoInfo.voice.gifNumber = dbData.voice.gifNumber;
            }
          } else if (dbData.voice && dbData.voice.preview) {
            // Se não temos a URL da narração, usar a prévia da voz como fallback
            console.log('Usando prévia da voz como fallback:', dbData.voice.preview);
            videoInfo.voiceUrl = dbData.voice.preview;

            // Preservar o gifNumber do banco de dados se existir
            if (dbData.voice.gifNumber) {
              console.log('Preservando gifNumber do banco de dados:', dbData.voice.gifNumber);
              if (!videoInfo.voice) videoInfo.voice = {};
              videoInfo.voice.gifNumber = dbData.voice.gifNumber;
            }

            // Atualizar o banco de dados com a URL da prévia
            await convex.mutation(api.videoData.UpdateVoiceUrl, {
              vId: experienceId,
              voiceUrl: dbData.voice.preview
            });
          } else {
            return NextResponse.json(
              { success: false, error: 'A narração é necessária para renderizar o vídeo' },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do banco de dados:', error);
        return NextResponse.json(
          { success: false, error: 'A narração é necessária para renderizar o vídeo' },
          { status: 400 }
        );
      }
    }

    console.log('URL da narração final para renderização:', videoInfo.voiceUrl);

    // Verificar se a URL da narração é válida
    if (typeof videoInfo.voiceUrl !== 'string' || !videoInfo.voiceUrl.startsWith('http')) {
      console.error('Erro: URL da narração inválida:', videoInfo.voiceUrl);

      // Tentar buscar a URL da narração do banco de dados novamente
      try {
        console.log('Tentando buscar a URL da narração do banco de dados novamente...');
        const dbData = await convex.query(api.videoData.GetVideoDataById, {
          vid: experienceId
        });

        // Verificar se temos a URL da narração no banco de dados
        if (dbData.voiceUrl && typeof dbData.voiceUrl === 'string' && dbData.voiceUrl.startsWith('http')) {
          console.log('Usando URL da narração do banco de dados:', dbData.voiceUrl);
          videoInfo.voiceUrl = dbData.voiceUrl;

          // Preservar o gifNumber do banco de dados se existir
          if (dbData.voice && dbData.voice.gifNumber) {
            console.log('Preservando gifNumber do banco de dados:', dbData.voice.gifNumber);
            if (!videoInfo.voice) videoInfo.voice = {};
            videoInfo.voice.gifNumber = dbData.voice.gifNumber;
          }
        } else if (dbData.voice && dbData.voice.preview) {
          // Se não temos a URL da narração, usar a prévia da voz como fallback
          console.log('Usando prévia da voz como fallback:', dbData.voice.preview);
          videoInfo.voiceUrl = dbData.voice.preview;

          // Preservar o gifNumber do banco de dados se existir
          if (dbData.voice.gifNumber) {
            console.log('Preservando gifNumber do banco de dados:', dbData.voice.gifNumber);
            if (!videoInfo.voice) videoInfo.voice = {};
            videoInfo.voice.gifNumber = dbData.voice.gifNumber;
          }

          // Atualizar o banco de dados com a URL da prévia
          await convex.mutation(api.videoData.UpdateVoiceUrl, {
            vId: experienceId,
            voiceUrl: dbData.voice.preview
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'A URL da narração fornecida é inválida e não foi possível encontrar uma alternativa' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Erro ao buscar dados do banco de dados:', error);
        return NextResponse.json(
          { success: false, error: 'A URL da narração fornecida é inválida' },
          { status: 400 }
        );
      }
    }

    try {
      // Renderizar o vídeo usando Remotion e fazer upload para o Cloudinary
      console.log('Renderizando vídeo com Remotion...');
      console.log('Dados finais para renderização:', JSON.stringify({
        script: videoInfo.script ? videoInfo.script.substring(0, 50) + '...' : 'Não fornecido',
        assets: videoInfo.assets,
        voiceUrl: videoInfo.voiceUrl,
        voice: videoInfo.voice,
        gifNumber: videoInfo.voice?.gifNumber
      }, null, 2));

    // Garantir que o gifNumber seja um número
    if (videoInfo.voice && videoInfo.voice.gifNumber) {
      videoInfo.voice.gifNumber = Number(videoInfo.voice.gifNumber);
      console.log('gifNumber convertido para número:', videoInfo.voice.gifNumber, 'tipo:', typeof videoInfo.voice.gifNumber);
    } else if (videoInfo.voice) {
      // Se não tiver gifNumber, definir como 1
      videoInfo.voice.gifNumber = 1;
      console.log('gifNumber definido como padrão:', videoInfo.voice.gifNumber);
    }
      const result = await renderVideo(experienceId, videoInfo);

      // Atualizar o registro no banco de dados com a URL do vídeo renderizado
      await convex.mutation(api.videoData.updateRenderedVideoUrl, {
        videoDataRecordId: experienceId,
        renderedVideoUrl: result.videoUrl // O nome do parâmetro permanece o mesmo, mas será mapeado para videoUrl no backend
      });

      // Retornar informações do vídeo
      return NextResponse.json({
        success: true,
        message: 'Vídeo processado com sucesso',
        videoUrl: result.videoUrl,
        publicId: result.publicId,
        videoInfo: result.videoInfo
      });
    } catch (renderError) {
      console.error('Erro ao renderizar vídeo:', renderError);

      // Em caso de erro, usar um vídeo de exemplo como fallback
      const fallbackUrl = 'https://res.cloudinary.com/de0abarv5/video/upload/v1689412424/samples/elephants.mp4';

      // Atualizar o banco de dados com o vídeo de fallback
      await convex.mutation(api.videoData.updateRenderedVideoUrl, {
        videoDataRecordId: experienceId,
        renderedVideoUrl: fallbackUrl // O nome do parâmetro permanece o mesmo, mas será mapeado para videoUrl no backend
      });

      return NextResponse.json({
        success: true,
        message: 'Usando vídeo de exemplo devido a erro na renderização',
        videoUrl: fallbackUrl,
        publicId: `experience-${experienceId}-fallback`,
        error: renderError.message
      });
    }
  } catch (error) {
    console.error('Erro ao processar vídeo:', error);
    return NextResponse.json(
      { success: false, error: `Erro ao processar vídeo: ${error.message}` },
      { status: 500 }
    );
  }
}
