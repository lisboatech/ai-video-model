"use client"
import React, { useContext, useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { LoaderCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { UserDetailContext } from '../../../context/UserDetailContext'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function CreateAds() {
    
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const router = useRouter();
    const CreateNewVideoData = useMutation(api.videoData.CreateNewVideoData);

    const GenerateAIVideoScript= async () => {

        /*if(userDetail?.credits < 10){
            
            toast('Please add more credits!');
            return;
        }*/


        setLoading(true);
        const result = await axios.post('/api/generate-script', {
            topic: userInput
        });
        console.log(result.data);
        const RAWResult = (result?.data).replace('```json','').replace('```','');
        const JSONResult = JSON.parse(RAWResult);
        const resp = await CreateNewVideoData({
            uid: userDetail?._id,
            topic: userInput,
            scriptVariant: JSONResult
        });
        console.log(resp);
        setLoading(false);

        // Redirect user to new Route
        router.push('/workspace/create-ad/' + resp);
        

    }
    
    return (

        <div className='mt-32 flex flex-col items-center justify-center w-full'>
            <div>
                <Image src={'/advertisement.png'} alt='icon' width={150} height={150} />
            </div>
            <h2 className='font-bold text-2xl text-center'>🎥Create AI Video Ads in Just One Click!</h2>
            <p className='mt-3 text-lg text-gray-500'>
                🚀 Turn your ideias into stunning, scroll-stopping vídeos
                — instantly, effortlessly, and without editing skills!
            </p>

            <Input
                placeholder='Enter the topic or product info'
                className={'w-lg text-lg mt-5'}
                onChange={(e) => setUserInput(e.target.value)}
            />

            <Button 
                className={'mt-5 w-md'}
                onClick={GenerateAIVideoScript}
                disabled={loading}
            >
                {loading ? <LoaderCircle className='animate-spin'/> : <Sparkles />}
                Generate
            </Button>
        </div>
    )
}

export default CreateAds