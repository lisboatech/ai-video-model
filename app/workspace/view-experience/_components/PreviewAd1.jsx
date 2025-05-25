import React, { useRef } from 'react'
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, Sequence, interpolate, spring } from 'remotion'

// Componente para imagens com estilo Apple minimalista e elegante
const SimpleImage = ({ src, index }) => {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Container principal com fundo sutil */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
      }}>
        {/* Container da imagem com estilo Apple */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Imagem principal */}
          <img
            src={src}
            alt={`Momento ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.5s ease-out',
              animation: 'subtle-zoom 30s ease-in-out infinite alternate',
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
          }} />
        </div>
      </div>

      {/* Estilo global para animação */}
      <style jsx global>{`
        @keyframes subtle-zoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};



function PreviewAd1(props) {
    // Obter o frame atual e a configuração do vídeo
    const frame = useCurrentFrame();
    const { durationInFrames, fps } = useVideoConfig();

    // Não há mais transição, o vídeo mostra apenas a imagem estática

    console.log("PreviewAd1 props:", props);

    // Processar props para lidar com diferentes formatos
    let videoInfo = props.videoInfo;

    // Quando usado com o Remotion CLI, props pode ser passado de várias formas
    // Tentar todas as possibilidades
    if (!videoInfo) {
        // Verificar se props é um objeto com uma propriedade file
        if (props && props.file && typeof props.file === 'string') {
            try {
                if (typeof window === 'undefined') {
                    const fs = require('fs');
                    const fileContent = fs.readFileSync(props.file, 'utf-8');
                    videoInfo = JSON.parse(fileContent);
                }
            } catch (error) {
                console.error('Erro ao ler arquivo de props.file:', error);
            }
        }

        // Verificar se props é um caminho de arquivo
        if (!videoInfo && typeof props === 'string') {
            try {
                if (typeof window === 'undefined') {
                    const fs = require('fs');
                    const fileContent = fs.readFileSync(props, 'utf-8');
                    videoInfo = JSON.parse(fileContent);
                }
            } catch (error) {
                console.error('Erro ao ler arquivo de props:', error);
            }
        }
    }

    // Se ainda não temos videoInfo, usar um objeto vazio
    if (!videoInfo) {
        videoInfo = {
            assets: [],
            voiceUrl: null,
            voice: {
                backgroundMusic: 'emocional',
                sphereColor: 'love',
                gifNumber: 1 // Valor padrão para o número do GIF
            },
            script: "Mensagem para o Dia das Mães"
        };
    }

    // Referência para o elemento de áudio
    const audioRef = useRef(null);

    // Usar apenas a primeira imagem e exibi-la durante todo o vídeo
    // Se não houver imagem, usar uma imagem de fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=2000&auto=format&fit=crop';
    const firstImage = videoInfo?.assets?.length > 0 ? videoInfo.assets[0] : fallbackImage;

    console.log("Primeira imagem:", firstImage);
    console.log("VideoInfo completo:", videoInfo);

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Imagem estática durante todo o vídeo */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
            }}>
                {firstImage ? (
                    <SimpleImage
                        src={firstImage}
                        index={0}
                    />
                ) : (
                    // Fundo preto se não houver imagens
                    <AbsoluteFill style={{ backgroundColor: 'black' }} />
                )}
            </div>

            {/* Componente Audio do Remotion para a narração */}
            {videoInfo?.voiceUrl && (
                <Audio
                    src={videoInfo.voiceUrl}
                    volume={1}
                    ref={audioRef}
                />
            )}

            {/* Música de fundo com volume reduzido para não atrapalhar a narração */}
            {videoInfo?.voice?.backgroundMusic && (
                <Audio
                    src={typeof window !== 'undefined'
                        ? `/audio/background/${videoInfo.voice.backgroundMusic}.mp3`
                        : `${process.cwd()}/public/audio/background/${videoInfo.voice.backgroundMusic}.mp3`}
                    volume={0.3} // Volume reduzido para não atrapalhar a narração
                />
            )}

            {/* Fallback para debug - remover após testes */}
            {!videoInfo?.voice?.backgroundMusic && videoInfo?.voice && (
                <Audio
                    src={typeof window !== 'undefined'
                        ? "/audio/background/emocional.mp3"
                        : `${process.cwd()}/public/audio/background/emocional.mp3`}
                    volume={0.3}
                />
            )}
        </AbsoluteFill>
    );
}

export default PreviewAd1;
