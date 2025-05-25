import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, Img } from 'remotion';

/**
 * Componente de vídeo simplificado para renderização
 * Este componente é projetado para ser mais simples e robusto para renderização no servidor
 */
export const SimpleVideo = ({ videoInfo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Valores padrão para videoInfo
  const defaultVideoInfo = {
    assets: [],
    voiceUrl: null,
    voice: {
      backgroundMusic: 'emocional',
      sphereColor: 'love'
    },
    script: "Mensagem para o Dia das Mães"
  };

  // Mesclar com valores padrão
  const info = videoInfo || defaultVideoInfo;

  // Duração total do vídeo em frames (30fps * 30 segundos = 900 frames)
  const totalDuration = durationInFrames;

  // Calcular a duração de cada imagem
  const imageDuration = Math.floor(totalDuration / (info.assets?.length || 1));

  // Texto da mensagem
  const message = info.script || "Mensagem para o Dia das Mães";

  // Cor da esfera
  const sphereColor = info.voice?.sphereColor === 'love' ? '#ff3333' : '#ff3333';

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Primeira parte: Esfera colorida com texto */}
      <Sequence from={0} durationInFrames={Math.floor(totalDuration * 0.3)}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          {/* Esfera colorida */}
          <div
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${sphereColor} 0%, #990000 100%)`,
              boxShadow: '0 0 50px rgba(255, 0, 0, 0.5)',
              marginBottom: '2rem',
            }}
          />

          {/* Texto da mensagem */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '2rem',
              borderRadius: '10px',
              maxWidth: '80%',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'white',
                fontSize: '2rem',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              {message}
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Segunda parte: Slideshow de imagens */}
      {info.assets && info.assets.length > 0 && (
        <Sequence from={Math.floor(totalDuration * 0.3)} durationInFrames={Math.floor(totalDuration * 0.6)}>
          <AbsoluteFill>
            {info.assets.map((img, index) => {
              const startFrame = index * imageDuration;
              const endFrame = (index + 1) * imageDuration;

              // Só renderizar a imagem atual
              if (frame < startFrame || frame >= endFrame) {
                return null;
              }

              return (
                <AbsoluteFill
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Img
                    src={img}
                    style={{
                      maxWidth: '80%',
                      maxHeight: '80%',
                      objectFit: 'contain',
                      borderRadius: '10px',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                </AbsoluteFill>
              );
            })}
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Terceira parte: Esfera colorida novamente */}
      <Sequence from={Math.floor(totalDuration * 0.9)} durationInFrames={Math.floor(totalDuration * 0.1)}>
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Esfera colorida */}
          <div
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${sphereColor} 0%, #990000 100%)`,
              boxShadow: '0 0 50px rgba(255, 0, 0, 0.5)',
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Áudio de narração */}
      {info.voiceUrl && (
        <Audio src={info.voiceUrl} volume={1} />
      )}

      {/* Música de fundo */}
      {info.voice?.backgroundMusic && (
        <Audio
          src={`${process.cwd()}/public/audio/background/${info.voice.backgroundMusic}.mp3`}
          volume={0.3}
        />
      )}
    </AbsoluteFill>
  );
};

export default SimpleVideo;
