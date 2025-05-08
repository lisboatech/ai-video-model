import { NextResponse } from "next/server"
import OpenAI from "openai"
import { GENERATE_SCRIPT_PROMPT } from "../../../services/Prompt"

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
})


export async function POST(req) {

    const {topic} = await req.json();

    const PROMPT = GENERATE_SCRIPT_PROMPT.replace('{topic}', topic);

    const completion = await openai.chat.completions.create({
        model: "qwen/qwen3-30b-a3b:free",
        messages: [
            { role: "user", content: PROMPT }
        ],
    })

    console.log('API Response:', completion)

    if (!completion?.choices?.[0]?.message?.content) {
        return NextResponse.json({ error: 'Resposta inválida da API' }, { status: 500 })
    }

    return NextResponse.json(completion.choices[0].message.content)
}