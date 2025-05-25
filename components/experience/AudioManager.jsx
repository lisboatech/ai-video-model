"use client"
import React, { useEffect, useRef, useState } from 'react'

// Mapeamento de IDs para arquivos de áudio
const BACKGROUND_MUSIC = {
  emocional: '/audio/background/emocional.mp3',
  gratidao: '/audio/background/gratidao.mp3',
  memorias: '/audio/background/memorias.mp3'
}

const AudioManager = ({
  isPlaying,
  backgroundMusicId = 'emocional',
  backgroundVolume = 0.5
}) => {
  const backgroundRef = useRef(null)
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  // Inicializar os elementos de áudio
  useEffect(() => {
    // Criar elemento de áudio
    backgroundRef.current = new Audio()

    // Configurar propriedades
    backgroundRef.current.loop = true
    backgroundRef.current.volume = backgroundVolume

    // Carregar os arquivos de áudio
    loadAudioFiles()

    // Cleanup
    return () => {
      if (backgroundRef.current) {
        backgroundRef.current.pause()
        backgroundRef.current.src = ''
      }
    }
  }, [])

  // Carregar os arquivos de áudio quando os IDs mudarem
  useEffect(() => {
    loadAudioFiles()
  }, [backgroundMusicId])

  // Controlar a reprodução com base no estado isPlaying
  useEffect(() => {
    if (isPlaying) {
      playAudio()
    } else {
      pauseAudio()
    }
  }, [isPlaying, backgroundLoaded])

  const loadAudioFiles = () => {
    // Carregar música de fundo
    if (backgroundRef.current) {
      console.log("Carregando música de fundo:", backgroundMusicId);

      // Verificar se a música existe no objeto BACKGROUND_MUSIC
      let backgroundSrc;
      if (BACKGROUND_MUSIC[backgroundMusicId]) {
        backgroundSrc = BACKGROUND_MUSIC[backgroundMusicId];
      } else {
        // Se não existir, tentar carregar diretamente do caminho
        backgroundSrc = `/audio/background/${backgroundMusicId}.mp3`;
        console.log("Tentando carregar diretamente:", backgroundSrc);
      }

      if (backgroundRef.current.src !== backgroundSrc) {
        backgroundRef.current.src = backgroundSrc;
        backgroundRef.current.load();

        backgroundRef.current.oncanplaythrough = () => {
          setBackgroundLoaded(true);
          console.log("Música carregada com sucesso:", backgroundSrc);
        };

        backgroundRef.current.onerror = (error) => {
          console.error("Erro ao carregar música:", error);
          // Fallback para a música padrão
          if (backgroundSrc !== BACKGROUND_MUSIC.emocional) {
            console.log("Usando música padrão como fallback");
            backgroundRef.current.src = BACKGROUND_MUSIC.emocional;
            backgroundRef.current.load();
          }
        };
      }
    }
  }

  const playAudio = () => {
    if (backgroundRef.current && backgroundLoaded) {
      backgroundRef.current.play().catch(error => {
        console.error('Erro ao reproduzir música de fundo:', error)
      })
    }
  }

  const pauseAudio = () => {
    if (backgroundRef.current) {
      backgroundRef.current.pause()
    }
  }

  // Este componente não renderiza nada visualmente
  return null
}

export default AudioManager
