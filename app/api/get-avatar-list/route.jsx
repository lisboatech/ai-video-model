import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const result = await axios.get('https://openapi.akool.com/api/open/v3/avatar/list?type=1',
            {
                headers: {
                    Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`
                }
            }
        );

        return NextResponse.json(result.data?.data);
    } catch (error) {
        console.error("Erro na API Akool:", error.response?.data || error.message);
        return NextResponse.json({ error: "Erro ao obter lista de avatares" }, { status: 500 });
    }
}