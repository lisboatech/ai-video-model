import React from 'react'
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'


export function AnimatedImage({ src, direction }) {

    const frame = useCurrentFrame();

    // Animation progress
    const progress = spring({
        frame,
        fps: 30,
        config: {
            damping: 100,
			stiffness: 200,
        },
    });


    // Different animations based on Direction
    const translateX = direction === 'left'
        ? interpolate(progress, [0, 1], [500, 0]) //Slide from 
        : direction === 'right'
            ? interpolate(progress, [0, 1], [-500, 0]) // 
            : 0;


    const scale = direction === 'zoom'
        ? interpolate(progress, [0, 1], [1.2, 1]) // Zoom 
        : 1;


    return (
        <img
            src={src}
            alt="Slide"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translateX(${translateX}px) 					scale(${scale})`
            }}
        />

    )

}


export function PreviewAd1({ videoInfo }) {
    console.log('VIDEOIBFO', videoInfo)
    
    const { durationInFrames } = useVideoConfig();
    const eachImageDuration = Math.floor(durationInFrames / videoInfo?.assets?.length);
    
    const directions=['left', 'right', 'zoom', 'left']

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'white'
            }}
        >
            <div 
                style={{
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Images slide show */}
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
            </div>


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

export default PreviewAd1;