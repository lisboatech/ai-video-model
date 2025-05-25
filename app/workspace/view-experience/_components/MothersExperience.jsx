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
        ? interpolate(progress, [0, 1], [500, 0]) //Slide from right to left
        : direction === 'right'
            ? interpolate(progress, [0, 1], [-500, 0]) //Slide from left to right
            : 0;

    const scale = direction === 'zoom'
        ? interpolate(progress, [0, 1], [1.2, 1]) // Zoom out
        : 1;

    return (
        <img
            src={src}
            alt="Slide"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translateX(${translateX}px) scale(${scale})`
            }}
        />
    )
}

export function MothersExperience({ experienceData }) {
    console.log('Experience Data:', experienceData)

    const { durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();

    // Calcular a duração de cada imagem com base no número total de imagens
    const eachImageDuration = Math.floor(durationInFrames / (experienceData?.assets?.length || 1));

    // Direções de animação para as imagens
    const directions = ['left', 'right', 'zoom', 'left'];

    // Texto da mensagem
    const message = experienceData?.script ||
                   (experienceData?.scriptVariant?.selectedMessage?.content ||
                    experienceData?.scriptVariant?.selectedMessage?.message ||
                    "Mensagem para o Dia das Mães");

    // Calcular a opacidade do texto com base no frame atual
    const textOpacity = interpolate(
        frame,
        [0, 30, durationInFrames - 30, durationInFrames],
        [0, 1, 1, 0]
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'black'
            }}
        >
            {/* Fundo com gradiente */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #ff0000 0%, #330000 100%)',
                    opacity: 0.3
                }}
            />

            {/* Slideshow de imagens */}
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    overflow: 'hidden'
                }}
            >
                {experienceData?.assets?.map((image, index) => (
                    <Sequence
                        key={index}
                        from={index * eachImageDuration}
                        durationInFrames={eachImageDuration}
                    >
                        <AnimatedImage
                            src={image}
                            direction={directions[index % directions.length]}
                        />
                    </Sequence>
                ))}
            </div>

            {/* Overlay escuro para melhorar a legibilidade do texto */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
            />

            {/* Texto da mensagem */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    right: '10%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    opacity: textOpacity,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h1
                    style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    }}
                >
                    Feliz Dia das Mães
                </h1>
                <p
                    style={{
                        fontSize: '18px',
                        lineHeight: 1.5,
                        maxWidth: '80%'
                    }}
                >
                    {message}
                </p>
            </div>

            {/* O áudio será controlado externamente pelo Player */}
        </AbsoluteFill>
    );
}

export default MothersExperience;
