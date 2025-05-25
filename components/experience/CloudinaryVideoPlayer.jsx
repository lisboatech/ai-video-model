'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Video, CloudinaryContext } from 'cloudinary-react'
import { LoaderCircle } from 'lucide-react'

/**
 * Componente de player de vídeo do Cloudinary
 *
 * @param {Object} props
 * @param {string} props.publicId - ID público do vídeo no Cloudinary
 * @param {string} props.cloudName - Nome da conta do Cloudinary
 * @param {string} props.className - Classes adicionais para o player
 * @param {boolean} props.autoPlay - Se o vídeo deve iniciar automaticamente
 * @param {boolean} props.controls - Se os controles devem ser exibidos
 * @param {boolean} props.loop - Se o vídeo deve repetir
 * @param {boolean} props.muted - Se o vídeo deve iniciar sem som
 * @param {string} props.fallbackUrl - URL de fallback caso o publicId não esteja disponível
 */
const CloudinaryVideoPlayer = ({
  publicId,
  cloudName = 'de0abarv5',
  className = '',
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  fallbackUrl = null
}) => {
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Resetar estado quando o publicId mudar
    setLoading(true)
    setError(null)
  }, [publicId])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = (err) => {
    console.error('Erro ao carregar vídeo do Cloudinary:', err)
    setError('Não foi possível carregar o vídeo')
    setLoading(false)
  }

  // Se temos uma URL de fallback e não temos publicId, usar o player HTML nativo
  if (!publicId && fallbackUrl) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <LoaderCircle className="animate-spin h-8 w-8 text-red-500" />
          </div>
        )}
        <video
          ref={videoRef}
          src={fallbackUrl}
          className="w-full h-full"
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
        />
      </div>
    )
  }

  // Se não temos nem publicId nem fallbackUrl, mostrar mensagem de erro
  if (!publicId && !fallbackUrl) {
    return (
      <div className={`flex items-center justify-center bg-black/20 rounded-lg ${className}`}>
        <p className="text-white/70 text-center p-4">
          Nenhum vídeo disponível
        </p>
      </div>
    )
  }

  // Usar o player do Cloudinary
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <LoaderCircle className="animate-spin h-8 w-8 text-red-500" />
        </div>
      )}
      <CloudinaryContext cloudName={cloudName}>
        <Video
          publicId={publicId}
          width="100%"
          height="100%"
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
          className="w-full h-full"
        />
      </CloudinaryContext>
    </div>
  )
}

export default CloudinaryVideoPlayer
