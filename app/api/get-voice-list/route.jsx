import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        let akoolVoices = [];

        // Tentar carregar vozes do Akool apenas se a API key estiver configurada
        if (process.env.AKOOL_API_TOKEN) {
            try {
                console.log("🎭 Carregando vozes do Akool...");
                const result = await axios.get('https://openapi.akool.com/api/open/v3/voice/list',
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`
                        }
                    }
                );

                akoolVoices = result.data?.data || [];
                console.log(`✅ ${akoolVoices.length} vozes Akool carregadas`);
            } catch (akoolError) {
                console.warn("⚠️ Erro ao carregar vozes Akool (continuando sem elas):", akoolError.response?.data || akoolError.message);
                akoolVoices = [];
            }
        } else {
            console.log("ℹ️ AKOOL_API_TOKEN não configurado, pulando vozes Akool");
        }

        // Sempre retornar pelo menos uma lista vazia para não quebrar o frontend
        return NextResponse.json(akoolVoices);

    } catch (error) {
        console.error("❌ Erro geral na API de vozes:", error);
        // Retornar lista vazia em vez de erro para não quebrar o frontend
        return NextResponse.json([]);
    }
}