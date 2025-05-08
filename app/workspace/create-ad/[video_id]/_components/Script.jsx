import React from 'react'
import { Input } from '../../../../../components/ui/input'
import { Textarea } from '../../../../../components/ui/textarea'
import { Video } from 'lucide-react'

export function Script({ videoData, onHandleInputChange }) {
    return (
        <div className='p-5 shadow rounded-xl'>
            <h2 className='font-bold text-lg flex gap-2 items-center'>
                <Video className='p-2 bg-green-600 text-white h-10 w-10 rounded-md'/>
                Video Ads Scripts
            </h2>

            <hr className='my-3' />

            <div className=''>
                <label className='text-gray-500'>Video Project Topic</label>
                <Input
                    className={'text-lg'}
                    value={videoData?.topic}
                />
            </div>

            <div className='mt-3'>
                <label className='text-gray-500'>Video Script</label>
                <Textarea
                    className={'text-lg'}
                    onChange={(e) => onHandleInputChange('script', e.target.value)}
                    value={videoData?.script ?? (videoData?.scriptVariant && videoData?.scriptVariant.length > 0 ? videoData?.scriptVariant[0]?.content : '')}
                />
            </div>

            <div className='grid grid-cols-3 gap-3 mt-3'>
                {videoData?.scriptVariant && videoData?.scriptVariant.length > 0 && videoData?.scriptVariant?.map((script, index) => (
                    <div
                        key={index}
                        className={`p-5 text-sm border rounded-lg cursor-pointer
                            ${script?.content == videoData?.script && 'border-primary bg-blue-100 text-primary'}
                        `}
                        onClick={() => onHandleInputChange('script', script?.content)}
                    >
                        <h2 className='line-clamp-3'>{script?.content}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Script