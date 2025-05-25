import { inngest } from '../client';
import axios from 'axios';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// Inicializar o cliente Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Função para gerar a voz usando uma API de TTS
export const createVoice = inngest.createFunction(
  { id: 'create-voice' },
  { event: 'voice.create' },
  async ({ event, step }) => {
    const { script, voiceId, videoRecordId } = event.data;

    // Verificar se temos todos os dados necessários
    if (!script) {
      throw new Error('Script não fornecido para geração de voz');
    }

    // Gerar a voz usando a API Akool
    const audioUrl = await step.run('generate-voice-audio', async () => {
      try {
        // Chamar a API Akool para gerar a voz
        const result = await axios.post('https://openapi.akool.com/api/open/v3/audio/create', {
          "input_text": script,
          "voice_id": voiceId,
          "rate": "100%",
        }, {
          headers: {
            Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
          }
        });

        const generateVoiceId = result?.data?.data?._id;

        // Função para verificar o status da geração de voz
        const pool = async (retries = 10, interval = 2000) => {
          for (let i = 0; i < retries; i++) {
            const poolRes = await axios.get('https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=' + generateVoiceId, {
              headers: {
                Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
              }
            });

            const status = poolRes?.data?.data?.status;
            if (status === 3) {
              return poolRes.data.data.url; // Áudio está pronto
            } else if (status === 4) {
              throw new Error("Falha no processamento do áudio");
            }

            await new Promise(resolve => setTimeout(resolve, interval));
          }
          throw new Error("Tempo limite excedido para geração de áudio");
        };

        // Aguardar a conclusão da geração de voz
        return await pool();
      } catch (error) {
        console.error('Erro ao gerar áudio da voz:', error);
        throw error;
      }
    });

    // Atualizar o registro no banco de dados com a URL do áudio
    if (videoRecordId) {
      await step.run('update-database', async () => {
        try {
          await convex.mutation(api.videoData.UpdateVoiceUrl, {
            vId: videoRecordId,
            voiceUrl: audioUrl
          });

          return { success: true };
        } catch (error) {
          console.error('Erro ao atualizar banco de dados:', error);
          throw error;
        }
      });
    }

    return {
      success: true,
      audioUrl,
      videoRecordId
    };
  }
);
