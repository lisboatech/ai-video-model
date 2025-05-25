import React from 'react';
import { AbsoluteFill, Audio } from 'remotion';
import emocionalAudio from '../public/audio/background/emocional.mp3';
import gratidaoAudio from '../public/audio/background/gratidao.mp3';
import memoriasAudio from '../public/audio/background/memorias.mp3';

/**
 * Componente de vídeo para o Dia das Mães - Versão ultra simplificada
 */
export const MothersDayVideo = ({
  images = [],
  audioUrl = null,
  visualizationOptions = { color: '#ff0000', sphereColor: 'love' },
  backgroundMusic = 'emocional'
}) => {
  // Usar apenas a primeira imagem e exibi-la durante todo o vídeo
  const firstImage = images.length > 0 ? images[0] : null;

  // Log para depuração
  console.log('MothersDayVideo - visualizationOptions:', JSON.stringify(visualizationOptions));

  return (
    <AbsoluteFill>
      {/* Imagem principal que cobre toda a tela - SEMPRE VISÍVEL desde o frame 0 */}
      <img
        src={firstImage}
        alt="Momento especial"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* Overlay com gradiente sutil estilo Apple */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Vinheta sutil para dar profundidade */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.7)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* Brilho sutil no topo - estilo Apple */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 4,
      }} />

      {/* Áudio da narração - igual à prévia */}
      {audioUrl && <Audio src={audioUrl} volume={1} />}

      {/* Música de fundo - igual à prévia */}
      {backgroundMusic && (
        <Audio
          src={
            backgroundMusic === 'emocional' ? emocionalAudio :
            backgroundMusic === 'gratidao' ? gratidaoAudio :
            backgroundMusic === 'memorias' ? memoriasAudio :
            emocionalAudio // Fallback para emocional
          }
          volume={0.3}
        />
      )}
    </AbsoluteFill>
  );
};
