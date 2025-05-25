import { NextResponse } from "next/server";
const ElevenLabsService = require('../../../lib/elevenlabs-service');

export async function POST(req) {
    try {
        const { voiceType = 'female' } = await req.json();

        console.log("🎧 Gerando preview ElevenLabs:", { voiceType });

        // Verificar se há pelo menos uma API key configurada
        const hasApiKey = process.env.ELEVENLABS_API_KEY_1 || 
                         process.env.ELEVENLABS_API_KEY_2 || 
                         process.env.ELEVENLABS_API_KEY_3;

        if (!hasApiKey) {
            console.error("Nenhuma API key do ElevenLabs configurada");
            return NextResponse.json({
                success: false,
                error: "Serviço de preview não configurado"
            }, { status: 500 });
        }

        // Texto curto para preview
        const previewText = voiceType === 'female' 
            ? "Olá! Esta é uma prévia da voz feminina premium. Perfeita para mensagens carinhosas."
            : "Olá! Esta é uma prévia da voz masculina premium. Ideal para mensagens emotivas.";

        // Inicializar serviço ElevenLabs
        const elevenLabsService = new ElevenLabsService();

        // Verificar capacidade (preview usa poucos caracteres)
        if (!elevenLabsService.hasCapacity(previewText.length)) {
            console.warn("⚠️ Limite do ElevenLabs atingido, não é possível gerar preview");
            return NextResponse.json({
                success: false,
                error: "Limite de preview atingido. Tente novamente mais tarde."
            }, { status: 429 });
        }

        // Gerar áudio de preview
        console.log("🔊 Gerando preview de áudio...");
        const result = await elevenLabsService.generateSpeech(previewText, voiceType);

        // Salvar arquivo de preview
        const filename = `preview_${voiceType}_${Date.now()}.mp3`;
        const audioUrl = await elevenLabsService.saveAudioFile(result.audioBuffer, filename);

        console.log("✅ Preview gerado com sucesso:", {
            audioUrl,
            account: result.account,
            voice: result.voice,
            charactersUsed: result.charactersUsed
        });

        return NextResponse.json({
            success: true,
            audioUrl: audioUrl,
            voiceType: voiceType,
            metadata: {
                account: result.account,
                voice: result.voice,
                charactersUsed: result.charactersUsed,
                filename: filename,
                previewText: previewText
            },
            message: `Preview gerado com sucesso usando ${result.account}`
        });

    } catch (error) {
        console.error("❌ Erro na geração de preview ElevenLabs:", error);

        // Diferentes tipos de erro
        let errorMessage = "Erro interno na geração de preview";
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
