import axios from "axios";
import { NextResponse } from "next/server";
import { resolve } from "styled-jsx/css";

export async function POST(req) {
    const { script, voiceId } = await req.json();
    const result = await axios.post('https://openapi.akool.com/api/open/v3/audio/create', {
        "input_text": script,
        "voice_id": voiceId,
        "rate": "100%",
    },
        {
            headers: {
                Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
            }
        }
    );

    //console.log(result.data);

    const generateVoiceId = result?.data?.data?._id;
 
    const pool = async(retries=10, interval=2000)=>{
        for(let i=0; i<retries; i++)
        {
            const poolRes = await axios.get('https://openapi.akool.com/api/open/v3/audio/infobymodelid?audio_model_id=' + generateVoiceId,
                {
                    headers: {
                        Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
                    }
                }
            );
            const status = poolRes?.data?.data?.status;
            if(status === 3)
            {    
                return poolRes.data.data.url; // Audio is Ready
            }
            else if(status === 4)
            {
                throw new Error("Audio processing failed");
            }

            await new Promise(resolve=>setTimeout(resolve, interval));
        }

    }

    const audioUrl = await pool();

    return NextResponse.json({
        audioUrl: audioUrl
    });
   
}