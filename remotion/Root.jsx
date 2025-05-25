import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import { MothersDayVideo } from './MothersDay';
import PreviewAd1 from '../app/workspace/view-experience/_components/PreviewAd1';
import { SimpleVideo } from './SimpleVideo';

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="Empty"
                component={MyComposition}
                durationInFrames={60}
                fps={30}
                width={1280}
                height={720}
            />
            <Composition
                id="MothersDay"
                component={MothersDayVideo}
                durationInFrames={900}
                fps={15}
                width={1080}
                height={1920}
                defaultProps={{
                    images: [],
                    audioUrl: null,
                    visualizationOptions: { color: '#ff0000' }
                }}
            />
            <Composition
                id="PreviewAd"
                component={PreviewAd1}
                durationInFrames={2400}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    videoInfo: {
                        assets: [],
                        voiceUrl: null,
                        voice: {
                            backgroundMusic: 'emocional',
                            sphereColor: 'love'
                        },
                        script: "Mensagem para o Dia das Mães"
                    }
                }}
            />
            <Composition
                id="SimpleVideo"
                component={SimpleVideo}
                durationInFrames={900}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    assets: [],
                    voiceUrl: null,
                    voice: {
                        backgroundMusic: 'emocional',
                        sphereColor: 'love'
                    },
                    script: "Mensagem para o Dia das Mães"
                }}
            />
        </>
    );
};