import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
const ElevenLabsService = require('../../../lib/elevenlabs-service');

// Inicializar o cliente Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req) {
    const { script, voiceType = 'female', videoRecordId } = await req.json();

    try {
        console.log("🎙️ Gerando voz com ElevenLabs:", {
            script: script?.substring(0, 50) + '...',
            voiceType,
            videoRecordId
        });

        // Validações básicas
        if (!script || script.trim().length === 0) {
            console.error("Script não fornecido ou vazio");
            return NextResponse.json({
                success: false,
                error: "Script é obrigatório para gerar a voz"
            }, { status: 400 });
        }

        // Verificar se há pelo menos uma API key configurada
        const hasApiKey = process.env.ELEVENLABS_API_KEY_1 ||
                         process.env.ELEVENLABS_API_KEY_2 ||
                         process.env.ELEVENLABS_API_KEY_3;

        if (!hasApiKey) {
            console.error("Nenhuma API key do ElevenLabs configurada");
            return NextResponse.json({
                success: false,
                error: "Serviço de voz não configurado"
            }, { status: 500 });
        }

        // Inicializar serviço ElevenLabs
        const elevenLabsService = new ElevenLabsService();

        // Verificar capacidade antes de tentar gerar
        if (!elevenLabsService.hasCapacity(script.length)) {
            console.warn("⚠️ Limite do ElevenLabs atingido para este mês");
            return NextResponse.json({
                success: false,
                error: "Limite mensal de caracteres atingido. Tente novamente no próximo mês.",
                usage: elevenLabsService.getUsageStatus()
            }, { status: 429 });
        }

        // Gerar áudio com ElevenLabs
        console.log("🔊 Iniciando geração de áudio...");
        const result = await elevenLabsService.generateSpeech(script, voiceType);

        // Salvar arquivo de áudio
        const filename = `elevenlabs_${Date.now()}_${voiceType}.mp3`;
        const audioUrl = await elevenLabsService.saveAudioFile(result.audioBuffer, filename);

        console.log("✅ Áudio gerado com sucesso:", {
            audioUrl,
            account: result.account,
            voice: result.voice,
            charactersUsed: result.charactersUsed
        });

        // Atualizar banco de dados se temos videoRecordId
        if (videoRecordId) {
            try {
                console.log("💾 Atualizando URL da voz no banco de dados...");

                // Verificar se o registro existe
                const videoData = await convex.query(api.videoData.GetVideoDataById, {
                    vid: videoRecordId
                });

                if (!videoData) {
                    console.error("Registro de vídeo não encontrado:", videoRecordId);
                } else {
                    // Atualizar com a URL da voz
                    await convex.mutation(api.videoData.UpdateVoiceUrl, {
                        vId: videoRecordId,
                        voiceUrl: audioUrl
                    });

                    // Verificar se foi salvo
                    const updatedVideoData = await convex.query(api.videoData.GetVideoDataById, {
                        vid: videoRecordId
                    });

                    if (updatedVideoData.voiceUrl === audioUrl) {
                        console.log("✅ URL da voz salva no banco de dados");
                    } else {
                        console.warn("⚠️ URL da voz pode não ter sido salva corretamente");
                    }
                }
            } catch (dbError) {
                console.error("❌ Erro ao atualizar banco de dados:", dbError);
                // Não falhar a requisição por erro de DB
            }
        }

        // Obter status de uso atualizado
        const usageStatus = elevenLabsService.getUsageStatus();

        return NextResponse.json({
            success: true,
            audioUrl: audioUrl,
            provider: 'elevenlabs',
            metadata: {
                account: result.account,
                voice: result.voice,
                charactersUsed: result.charactersUsed,
                filename: filename,
                usage: usageStatus
            },
            message: `Voz gerada com sucesso usando ${result.account}`
        });

    } catch (error) {
        console.error("❌ Erro na geração de voz ElevenLabs:", error);

        // Diferentes tipos de erro
        let errorMessage = "Erro interno na geração de voz";
        let statusCode = 500;

        if (error.message.includes('API key')) {
            errorMessage = "Configuração de API inválida";
            statusCode = 401;
        } else if (error.message.includes('limite') || error.message.includes('limit')) {
            errorMessage = "Limite de uso atingido";
            statusCode = 429;
        } else if (error.message.includes('rate')) {
            errorMessage = "Muitas requisições. Tente novamente em alguns segundos.";
            statusCode = 429;
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: error.message,
            provider: 'elevenlabs'
        }, { status: statusCode });
    }
}

// Endpoint para verificar status de uso
export async function GET() {
    try {
        const elevenLabsService = new ElevenLabsService();
        const usageStatus = elevenLabsService.getUsageStatus();

        return NextResponse.json({
            success: true,
            usage: usageStatus,
            provider: 'elevenlabs'
        });

    } catch (error) {
        console.error("❌ Erro ao obter status de uso:", error);
        return NextResponse.json({
            success: false,
            error: "Erro ao obter status de uso"
        }, { status: 500 });
    }
}
