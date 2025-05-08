"use client"
import { useConvex, useMutation, useQuery} from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import Script from './_components/Script'
import UploadFiles  from './_components/UploadFiles'
import AvatarList  from './_components/AvatarList'
import VoiceList  from './_components/VoiceList'
import { Button } from '../../../../components/ui/button';
import { LoaderCircle, Sparkles } from 'lucide-react';
import ImageKit from 'imagekit';
import axios from 'axios';
import { UserDetailContext } from '../../../../context/UserDetailContext';


export function CreateVideo() {
    const { video_id } = useParams();
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail} = useContext(UserDetailContext);
    const createVideoDataEntry = useMutation(api.videoData.updateInitialVideoData);
    const router = useRouter();
    const UpdateUserCredits=useMutation(api.users.updateUserCredits)

    // const VideoData = useQuery(api.videoData.GetVideoDataById, {
    //    vid: video_id
    //});

    const imageKit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
    });

    const convex = useConvex();

    useEffect(() => {
        GetVideoData();
    }, [])

    const GetVideoData = async () => {
        const result = await convex.query(api.videoData.GetVideoDataById, {
            vid: video_id
        });
        console.log(result);
        setVideoData(result);
    }


    const onHandleInputChange = async(field, value) => {
        setVideoData(prev => ({
            ...prev,
            [field]: value
        }))
        console.log(videoData)
    }


   const GenerateVideo = async () => {
        // Upload The Images
        setLoading(true);
        const rawFiles = videoData?.rawFiles;
        let uploadedFiles = [];
        rawFiles.forEach(async (file) => {
            const imageRef = await imageKit.upload({
                file: file,
                fileName: Date.now().toString() + ".png",
                isPublished: true
            });
            console.log(imageRef.url);
            uploadedFiles.push(imageRef.url);
        });

        if (rawFiles) {
            const uploadPromises = rawFiles.map(async (file) =>
                await imageKit.upload({
                    file: file,
                    fileName: Date.now().toString() + ".png",
                    isPublished: true
                })
            )
            try{
                const uploadedFilesPromise = await Promise.all(uploadPromises);
                const uploadedFiles = uploadedFilesPromise.map((imageRef) => imageRef.url);
                console.log(uploadedFiles);
                onHandleInputChange('assets', uploadedFiles);
            }catch(e){
                console.log("Error", e);
            }

        }
        

        // Generate Voice + Generate Avatar
        
        const result = await axios.post('/api/create-voice', {
            script: videoData?.script,
            voiceId: videoData?.voice?.voice_id
        });

        console.log(result.data?.audioUrl);
      
        onHandleInputChange('voiceUrl', result.data?.audioUrl);


        // Generate Avatar using AKOOL Use Inngest function to Call this API

        const AvatarResult = await axios.post('/api/create-avatar', {
            voiceUrl: result.data?.audioUrl,
            avatarId: videoData?.avatar?.avatar_id,
            videoRecordId: video_id
        });

        console.log(AvatarResult.data);
        //onHandleInputChange('avatarUrl', AvatarResult.data?.avatarVideoUrl);
        

        // Update Credits
       setUserDetail(prev => ({
           ...prev,
           credits: Number(userDetail?.credits) - 10
       }))


        // Update Credits to DB
       const resp = await UpdateUserCredits({
           credits: Number(userDetail?.credits) - 10,
           uid: userDetail?._id
       });
       console.log(resp);


        setLoading(false);
        router.replace('/workspace')

    }


    useEffect(() => {
        async function saveDB() {
            if (videoData?.voiceUrl) {
                const result = await createVideoDataEntry({
                    topic: videoData?.topic,
                    scriptVariant: videoData?.scriptVariant,
                    videoDataRecordId: video_id,
                    assets: videoData?.assets,
                    avatar: videoData?.avatar,
                    script: videoData?.script,
                    voice: videoData?.voice,
                    voiceUrl: videoData?.voiceUrl,
                });
                console.log(result);
    
                router.replace('/workspace')
            }
        }

        saveDB();
       
        
    }, [videoData?.voiceUrl])


    return (
        <div>
            <h2 className='font-bold text-2xl'>Create Video Ad</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 mt-8'>
                <div className='md:col-span-2'>
                    <Script
                        videoData={videoData}
                        onHandleInputChange={onHandleInputChange}
                    />
                    <UploadFiles
                        videoData={videoData}
                        onHandleInputChange={onHandleInputChange}
                    />
                    <AvatarList
                        videoData={videoData}
                        onHandleInputChange={onHandleInputChange}
                    />
                    <VoiceList
                        videoData={videoData}
                        onHandleInputChange={onHandleInputChange}
                    />
                    <Button
                        className={'mt-7 w-full'}
                        onClick={GenerateVideo}
                        disabled={loading}
                    >
                        {loading ? <LoaderCircle className='animate-spin'/> : <Sparkles />}
                        Generate
                    </Button>
                </div>

                <div>
                    Preview
                </div>

            </div>

        </div>
    )
}

export default CreateVideo