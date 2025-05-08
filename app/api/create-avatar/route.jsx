import { inngest } from "./../../../inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";
/**
 * 
 * @param {*} req 
 * @returns 
 * 
 * 
video_id: "134da055-359c-4099-b182-389898b64f86"
video_status: 1
_id: "681627c8e9ee9ee22c946302"
 */

export async function POST(req) {
    const { avatarId, voiceUrl, videoRecordId } = await req.json();

    // Get Avatar Generated ID
    /*
    const result = await axios.post('https://openapi.akool.com/api/open/v3/talkingavatar/create', {
        "width": 3840,
        "height": 2160,
        "avatar_from": 2,
        "elements": [
            {
                "type": "image",
                "url": "#ffffff00",
                "width": 780,
                "height": 438,
                "scale_x": 1,
                "scale_y": 1,
                "offset_x": 1920,
                "offset_y": 1080
            },
            {
                "type": "avatar",
                "scale_x": 1,
                "scale_y": 1,
                "width": 1080,
                "height": 1080,
                "offset_x": 1920,
                "offset_y": 1080,
                avatar_id: avatarId
            },
            {
                "type": "audio",
                "url": voiceUrl
            }
        ],

    },
        {
            headers: {
                Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
            }
        }

    )
    
    const generatedAvatarId= result.data?.data?._id; // '681627c8e9ee9ee22c946302'
    const pool = async (retries = 10, interval = 5000) => {
        for (let i = 0; i < retries; i++) {
            const poolRes = await axios.get('https://openapi.akool.com/api/open/v3/content/video/infobymodelid?video_model_id=' + generatedAvatarId,
                {
                    headers: {
                        Authorization: 'Bearer ' + process.env.AKOOL_API_TOKEN
                    }
                }
            );
            const status = poolRes?.data?.data?.video_status;
            if (status === 3) {
                return poolRes.data.data.video; // Audio is Ready
            }
            else if (status == 4) {
                throw new Error("Audio processing failed");
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }

    }

    const avatarVideoUrl = await pool();
    return NextResponse.json({
        avatarVideoUrl: avatarVideoUrl 
    });
    */
    

    await inngest.send({
        name: "create-avatar",
        data: {
            avatarId: avatarId,
            voiceUrl: voiceUrl,
            videoRecordId: videoRecordId
        },
    });

    return NextResponse.json({ message: "Event sent!" });

}