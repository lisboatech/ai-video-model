import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { script, voiceId } = await req.json();
        
        // Verificar se temos os dados necessários
        if (!script || !voiceId) {
            return NextResponse.json({ 
                error: "Texto e ID da voz são obrigatórios" 
            }, { status: 400 });
        }
        
        // Limitar o texto para a prévia (para processamento mais rápido)
        const previewText = script.length > 100 ? script.substring(0, 100) + "..." : script;
        
        // Chamar a API do Akool para gerar a prévia de voz
        const result = await axios.post('https://openapi.akool.com/api/open/v3/audio/create', {
            "input_text": previewText,
            "voice_id": voiceId,
            "rate": "100%",
        }, {
            headers: {
                Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
            }
        });

        const generateVoiceId = result?.data?.data?._id;
        if (!generateVoiceId) {
            throw new Error("Falha ao iniciar geração de áudio");
        }
        
        // Função para verificar o status do áudio
        const pollAudioStatus = async (retries = 10, interval = 2000) => {
            for (let i = 0; i < retries; i++) {
                const pollRes = await axios.get('https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=' + generateVoiceId, {
                    headers: {
                        Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
                    }
                });
                
                const status = pollRes?.data?.data?.status;
                
                if (status === 3) {
                    return pollRes.data.data.url; // Áudio está pronto
                } else if (status === 4) {
                    throw new Error("Falha no processamento do áudio");
                }
                
                // Aguardar antes de verificar novamente
                await new Promise(resolve => setTimeout(resolve, interval));
            }
            
            throw new Error("Tempo esgotado ao aguardar o áudio");
        };
        
        // Aguardar o áudio ficar pronto
        const audioUrl = await pollAudioStatus();
        
        return NextResponse.json({
            audioUrl: audioUrl,
            message: "Prévia de áudio gerada com sucesso"
        });
    } catch (error) {
        console.error("Erro ao gerar prévia de voz:", error);
        return NextResponse.json({ 
            error: "Erro ao gerar prévia de voz: " + (error.message || "Erro desconhecido") 
        }, { status: 500 });
    }
}
