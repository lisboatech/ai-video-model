import axios from "axios";
import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Inicializar o cliente Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req) {
    const { script, voiceId, videoRecordId } = await req.json();

    try {
        // Não vamos usar o Inngest por enquanto, pois está dando problemas
        // Vamos processar a voz diretamente e salvar no banco de dados

        // Processamento síncrono da voz
        console.log("Gerando voz para o script:", script);
        console.log("Voice ID:", voiceId);

        // Verificar se temos um token de API válido
        if (!process.env.AKOOL_API_TOKEN) {
            console.error("Token da API Akool não encontrado");
            throw new Error("Token da API Akool não configurado");
        }

        // Verificar se temos um voice ID válido
        if (!voiceId) {
            console.error("Voice ID não fornecido");
            throw new Error("Voice ID é obrigatório para gerar a voz");
        }

        // Verificar o formato do voiceId
        console.log("Tipo do voiceId:", typeof voiceId);
        console.log("Valor do voiceId:", voiceId);

        // Se o voiceId for um objeto, extrair o ID
        let finalVoiceId = voiceId;
        if (typeof voiceId === 'object' && voiceId !== null) {
            // A API do Akool espera o campo voice_id, não o _id
            if (voiceId.voice_id) {
                finalVoiceId = voiceId.voice_id;
                console.log("Extraindo voice_id do objeto voiceId:", finalVoiceId);
            } else if (voiceId._id) {
                finalVoiceId = voiceId._id;
                console.log("Extraindo _id do objeto voiceId:", finalVoiceId);
            } else if (voiceId.id) {
                finalVoiceId = voiceId.id;
                console.log("Extraindo id do objeto voiceId:", finalVoiceId);
            } else {
                console.error("Objeto voiceId não contém voice_id, _id ou id:", voiceId);
                throw new Error("Voice ID inválido");
            }
        }

        // Verificar se temos um script válido
        if (!script || script.trim().length === 0) {
            console.error("Script não fornecido ou vazio");
            throw new Error("Script é obrigatório para gerar a voz");
        }

        // Verificar se o finalVoiceId é válido
        if (!finalVoiceId || typeof finalVoiceId !== 'string') {
            console.error("Voice ID inválido:", finalVoiceId);
            throw new Error("Voice ID inválido. Verifique se a voz selecionada é válida.");
        }

        // Verificar se o finalVoiceId parece ser um ID do Akool (geralmente tem formato específico)
        if (finalVoiceId.length < 10) {
            console.warn("Voice ID parece ser muito curto:", finalVoiceId);
        }

        console.log("Parâmetros para geração de voz:", {
            input_text: script.substring(0, 50) + "...",
            voice_id: finalVoiceId,
            rate: "100%"
        });

        // Fazer a chamada para a API do Akool
        const result = await axios.post('https://openapi.akool.com/api/open/v3/audio/create', {
            "input_text": script,
            "voice_id": finalVoiceId,
            "rate": "100%",
        }, {
            headers: {
                Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
            }
        });

        // Verificar se a resposta é válida
        console.log("Resposta da API Akool:", JSON.stringify(result.data, null, 2));

        // Verificar se há um código de erro na resposta
        // Código 1000 é sucesso, outros códigos podem ser erros
        if (result.data && result.data.code && result.data.code !== 0 && result.data.code !== 1000) {
            console.error("Erro da API Akool:", result.data);

            // Mensagens de erro específicas para códigos conhecidos
            if (result.data.code === 1008) {
                throw new Error("A voz selecionada não existe. Por favor, selecione outra voz.");
            } else {
                throw new Error(`Erro da API Akool: ${result.data.msg || 'Erro desconhecido'}`);
            }
        }

        if (!result.data || !result.data.data || !result.data.data._id) {
            console.error("Resposta inválida da API Akool:", result.data);
            throw new Error("Resposta inválida da API Akool. Verifique se o voice_id está correto.");
        }

        const generateVoiceId = result.data.data._id;
        console.log("ID da voz gerada:", generateVoiceId);

        // Verificar o status do áudio
        // Status 2 = processando, 3 = pronto, 4 = erro
        const audioStatus = result.data.data.status;
        console.log("Status inicial do áudio:", audioStatus);

        const pool = async(retries=20, interval=2000) => {
            // Se o status inicial for 3 (pronto) e temos uma URL, retornar imediatamente
            if (audioStatus === 3 && result.data.data.url) {
                console.log("Áudio já está pronto:", result.data.data.url);
                return result.data.data.url;
            }

            for(let i=0; i<retries; i++) {
                try {
                    console.log(`Verificando status da voz (tentativa ${i+1}/${retries})...`);
                    console.log(`URL da requisição: https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=${generateVoiceId}`);

                    const poolRes = await axios.get('https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=' + generateVoiceId, {
                        headers: {
                            Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
                        }
                    });

                    console.log("Resposta completa da verificação de status:", JSON.stringify(poolRes.data, null, 2));

                    // Verificar se a resposta é válida
                    if (!poolRes.data || !poolRes.data.data) {
                        console.error("Resposta inválida da verificação de status:", poolRes.data);
                        // Continuar tentando em vez de falhar imediatamente
                        await new Promise(resolve => setTimeout(resolve, interval));
                        continue;
                    }

                    const status = poolRes.data.data.status;
                    console.log("Status da voz:", status);

                    if(status === 3) {
                        if (!poolRes.data.data.url) {
                            console.error("URL do áudio não encontrada na resposta:", JSON.stringify(poolRes.data, null, 2));

                            // Se estamos na última tentativa e temos uma prévia da voz, usar como fallback
                            if (i === retries - 1 && voiceId.preview) {
                                console.log("Usando prévia da voz como fallback:", voiceId.preview);
                                return voiceId.preview;
                            }

                            throw new Error("URL do áudio não encontrada na resposta");
                        }

                        console.log("Áudio pronto:", poolRes.data.data.url);
                        return poolRes.data.data.url; // Audio is Ready
                    } else if(status === 4) {
                        console.error("Falha no processamento do áudio");

                        // Se temos uma prévia da voz, usar como fallback
                        if (voiceId.preview) {
                            console.log("Usando prévia da voz como fallback após falha:", voiceId.preview);
                            return voiceId.preview;
                        }

                        throw new Error("Audio processing failed");
                    } else if(status === 2) {
                        console.log("Áudio ainda em processamento (status 2)");
                    } else {
                        console.log("Status desconhecido:", status);
                    }
                } catch (error) {
                    console.error(`Erro na verificação de status (tentativa ${i+1}/${retries}):`, error.message);
                    // Continuar tentando em vez de falhar imediatamente
                }

                console.log(`Aguardando ${interval/1000} segundos antes da próxima verificação...`);
                await new Promise(resolve => setTimeout(resolve, interval));
            }

            console.error("Tempo limite excedido para geração de áudio");

            // Se temos uma prévia da voz, usar como fallback
            if (voiceId.preview) {
                console.log("Usando prévia da voz como fallback após tempo limite:", voiceId.preview);
                return voiceId.preview;
            }

            throw new Error("Tempo limite excedido para geração de áudio");
        };

        const audioUrl = await pool();
        console.log("URL do áudio gerado:", audioUrl);

        // Se temos um ID de vídeo, atualizar o banco de dados diretamente
        if (videoRecordId) {
            try {
                console.log("Atualizando URL da voz no banco de dados para o vídeo:", videoRecordId);

                // Primeiro, verificar se o registro existe
                const videoData = await convex.query(api.videoData.GetVideoDataById, {
                    vid: videoRecordId
                });

                console.log("Dados atuais do vídeo:", {
                    hasVoiceUrl: !!videoData.voiceUrl,
                    voiceUrl: videoData.voiceUrl
                });

                // Atualizar o registro com a URL da voz
                await convex.mutation(api.videoData.UpdateVoiceUrl, {
                    vId: videoRecordId,
                    voiceUrl: audioUrl
                });

                // Verificar se a atualização foi bem-sucedida
                const updatedVideoData = await convex.query(api.videoData.GetVideoDataById, {
                    vid: videoRecordId
                });

                console.log("Dados atualizados do vídeo:", {
                    hasVoiceUrl: !!updatedVideoData.voiceUrl,
                    voiceUrl: updatedVideoData.voiceUrl
                });

                if (!updatedVideoData.voiceUrl) {
                    console.error("URL da voz não foi salva no banco de dados!");

                    // Tentar novamente com updateInitialVideoData
                    await convex.mutation(api.videoData.updateInitialVideoData, {
                        videoDataRecordId: videoRecordId,
                        topic: updatedVideoData.topic,
                        scriptVariant: updatedVideoData.scriptVariant,
                        voiceUrl: audioUrl
                    });

                    console.log("Tentativa adicional de salvar voiceUrl concluída");
                } else {
                    console.log("URL da voz atualizada com sucesso no banco de dados:", updatedVideoData.voiceUrl);
                }
            } catch (error) {
                console.error("Erro ao atualizar URL da voz no banco de dados:", error);
            }
        }

        return NextResponse.json({
            success: true,
            audioUrl: audioUrl
        });
    } catch (error) {
        console.error("Erro na geração de voz:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Erro na geração de voz"
        }, { status: 500 });
    }
}