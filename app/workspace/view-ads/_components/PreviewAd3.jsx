import React from 'react'
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, useVideoConfig } from 'remotion'
import { AnimatedImage } from './PreviewAd1';


export function PreviewAd3({ videoInfo }) {
    console.log('VIDEOIBFO', videoInfo)
    
    const { durationInFrames } = useVideoConfig();
    const eachImageDuration = Math.floor(durationInFrames / videoInfo?.assets?.length);
    const directions=['left', 'right', 'zoom', 'left']

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'white',
                position: 'relative'
            }}
            
        >
            {/* Fullscreen Images */}
            {videoInfo?.assets?.map((image, index) => (
                <Sequence
                    key={index}
                    from={index * eachImageDuration}
                    durationInFrames={eachImageDuration}
                >
                    <AnimatedImage
                        src={image}
                        direction={directions[index % directions?.length]}
                    />

                </Sequence>
            ))}



            <div
                style={{
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {videoInfo && <OffthreadVideo
                    src={videoInfo?.avatarUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(3)',
                        transformOrigin: 'center center'
                    }}
                />}
            </div>

        </AbsoluteFill>
    );
}

export default PreviewAd3;