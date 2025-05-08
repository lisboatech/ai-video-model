import { inngest } from "./client";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";



export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);


export const CreateAvatar = inngest.createFunction(
    { id: 'create-avatar' },
    { event: 'create-avatar' },
    async ({ event, step }) => {
        const { avatarId, voiceUrl, videoRecordId } = event.data;
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

        const CreateAvatarId = await step.run(
            "GenerateAvatarId",
            async () => {
                // Get Avatar Generated ID
                
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

                const generatedAvatarId= result.data?.data?._id
                return generatedAvatarId
                
                
               //return "681627c8e9ee9ee22c946302"
            }
        )


        const GenerateAvatar = await step.run(
            "GenerateAvatar",
            async () => {
                const pool = async (retries = 20, interval = 5000) => {
                    for (let i = 0; i < retries; i++) {
                        const poolRes = await axios.get('https://openapi.akool.com/api/open/v3/content/video/infobymodelid?video_model_id=' + CreateAvatarId,
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
                return avatarVideoUrl;
            }
        )


        // Save/ Update to Our DB

        const UpdateToDb = await step.run(
            "UpdateToDb",
            async () => {

                console.log("videoRecordId:", videoRecordId);
                console.log("GenerateAvatar:", GenerateAvatar);

                // Verificar se os valores são válidos
                if (!videoRecordId) {
                    console.error("videoRecordId is missing or invalid");
                    return;
                }


                const result = await convex.mutation(api.videoData.UpdateAvatarUrl,
                    {
                        vId: videoRecordId,
                        avatarUrl: GenerateAvatar || "",
                        status: 2
                    }
                )
                return result;
            }
        )
    }
)