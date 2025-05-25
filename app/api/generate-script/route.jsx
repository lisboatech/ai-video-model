import { NextResponse } from "next/server"
import OpenAI from "openai"
import { GENERATE_SCRIPT_PROMPT } from "../../../services/Prompt.jsx"

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
})


export async function POST(req) {
    try {
        const {topic, formData} = await req.json();

        // Criar um prompt mais detalhado se temos dados do formulário
        let enhancedPrompt = GENERATE_SCRIPT_PROMPT.replace('{topic}', topic);

        if (formData) {
            // Adicionar contexto personalizado ao prompt
            let contextualInfo = '\n\nContexto adicional para personalização:\n';

            if (formData.relationship) {
                contextualInfo += `- Relacionamento: ${formData.relationship}\n`;
            }

            if (formData.personName) {
                contextualInfo += `- Nome da pessoa: ${formData.personName}\n`;
            }

            if (formData.occasion) {
                contextualInfo += `- Ocasião: ${formData.occasion}\n`;
            }

            if (formData.memory && formData.memory.trim()) {
                contextualInfo += `- Memória especial fornecida pelo usuário: ${formData.memory}\n`;
            } else {
                contextualInfo += `- ATENÇÃO: Nenhuma memória específica foi fornecida - NÃO invente memórias falsas\n`;
            }

            if (formData.characteristics && formData.characteristics.trim()) {
                contextualInfo += `- Características especiais fornecidas pelo usuário: ${formData.characteristics}\n`;
            } else {
                contextualInfo += `- ATENÇÃO: Nenhuma característica específica foi fornecida - use características gerais apropriadas para o relacionamento\n`;
            }

            if (formData.tone) {
                contextualInfo += `- Tom desejado: ${formData.tone}\n`;
            }

            if (formData.senderName) {
                contextualInfo += `- Nome de quem está enviando: ${formData.senderName}\n`;
                contextualInfo += `- IMPORTANTE: Termine a mensagem com uma assinatura carinhosa usando o nome "${formData.senderName}" (exemplo: "Com amor, ${formData.senderName}" ou "Sempre sua, ${formData.senderName}" ou "Com carinho, ${formData.senderName}")\n`;
            }

            contextualInfo += '\n⚠️ IMPORTANTE: Use APENAS as informações fornecidas acima. NÃO invente memórias, situações ou detalhes que não foram mencionados pelo usuário. Se algo não foi fornecido, seja genérico mas emocionante.';
            enhancedPrompt += contextualInfo;
        }

        const PROMPT = enhancedPrompt;

        const completion = await openai.chat.completions.create({
            model: "qwen/qwen3-30b-a3b:free",
            messages: [
                { role: "user", content: PROMPT }
            ],
        });

        console.log('API Response:', completion);

        if (!completion?.choices?.[0]?.message?.content) {
            return NextResponse.json({ error: 'Resposta inválida da API' }, { status: 500 });
        }

        const content = completion.choices[0].message.content;

        try {
            // Tentar extrair JSON se estiver em formato de código
            let parsedContent;
            if (content.includes('```json') || content.includes('```')) {
                const jsonContent = content.replace(/```json|```/g, '').trim();
                parsedContent = JSON.parse(jsonContent);
            } else if (content.startsWith('{') && content.endsWith('}')) {
                // Se já for um objeto JSON
                try {
                    parsedContent = JSON.parse(content);

                    // Verificar se há JSON aninhado (problema comum com a IA)
                    if (parsedContent.scripts && parsedContent.scripts.length > 0) {
                        parsedContent.scripts = parsedContent.scripts.map(script => {
                            if (typeof script.content === 'string' && script.content.startsWith('{')) {
                                try {
                                    // Tentar fazer parse do JSON aninhado
                                    const nestedJson = JSON.parse(script.content);
                                    if (nestedJson.scripts) {
                                        return nestedJson.scripts; // Retornar os scripts aninhados
                                    }
                                } catch (e) {
                                    // Se falhar, manter o conteúdo original
                                    console.log('JSON aninhado inválido, mantendo original');
                                }
                            }
                            return script;
                        }).flat(); // Achatar array caso haja arrays aninhados
                    }
                } catch (parseError) {
                    console.error('Erro ao fazer parse do JSON:', parseError);
                    // Fallback para texto simples
                    parsedContent = {
                        scripts: [{
                            title: "Mensagem Personalizada",
                            content: content
                        }]
                    };
                }
            } else {
                // Se for texto simples, criar um objeto com scripts
                parsedContent = {
                    scripts: [{
                        title: "Mensagem Personalizada",
                        content: content
                    }]
                };
            }

            // Garantir que o resultado tenha o formato esperado
            if (!parsedContent.scripts) {
                parsedContent = {
                    scripts: [parsedContent]
                };
            }

            return NextResponse.json(parsedContent);
        } catch (error) {
            console.error('Erro ao processar resposta da API:', error);

            // Fallback: retornar um objeto com formato esperado
            return NextResponse.json({
                scripts: [{
                    title: "Mensagem Personalizada",
                    content: content
                }]
            });
        }
    } catch (error) {
        console.error('Erro ao gerar script:', error);
        return NextResponse.json({
            error: 'Erro ao gerar script',
            scripts: [{
                title: "Mensagem Personalizada",
                content: "Não foi possível gerar uma mensagem. Por favor, tente novamente."
            }]
        }, { status: 500 });
    }
}