"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { Download, Share2 } from 'lucide-react';
import Header from '../../workspace/[video_id]/_components/Header';

export default function VideoDownloadPage() {
  const { video_id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const convex = useConvex();

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const result = await convex.query(api.videoData.GetVideoDataById, {
          vid: video_id
        });

        if (result && result.videoUrl) {
          setVideoData(result);
        } else {
          toast.error("Vídeo não encontrado ou ainda não está pronto");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do vídeo:", error);
        toast.error("Erro ao carregar o vídeo");
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [video_id, convex]);

  const handleShare = () => {
    if (navigator.share && videoData?.videoUrl) {
      navigator.share({
        title: 'Vídeo Especial',
        text: 'Veja este vídeo especial que criei para você!',
        url: videoData.videoUrl
      })
      .then(() => toast.success('Compartilhado com sucesso!'))
      .catch((error) => {
        console.error('Erro ao compartilhar:', error);
        // Fallback: copiar URL para a área de transferência
        copyToClipboard(videoData.videoUrl);
      });
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      copyToClipboard(videoData.videoUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copiado para a área de transferência!'))
      .catch(err => toast.error('Erro ao copiar link'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl">Carregando seu vídeo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!videoData || !videoData.videoUrl) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center p-6">
            <h1 className="text-2xl mb-4">Vídeo não encontrado</h1>
            <p>Não foi possível encontrar o vídeo solicitado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Lado esquerdo - Vídeo */}
            <div className="flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ width: '320px', maxWidth: '100%' }}>
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent z-0"></div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"></div>

                <div className="relative z-1 rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                  <video
                    src={videoData.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    style={{ objectFit: 'contain', backgroundColor: 'black' }}
                  />
                </div>
              </div>
            </div>

            {/* Lado direito - Informações e botões */}
            <div className="flex flex-col gap-4 max-w-lg mx-auto md:mx-0">
              <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg">
                <h2 className="text-xl font-light mb-2 text-white">Seu vídeo está pronto!</h2>
                <p className="text-white/70 text-sm mb-6">
                  Baixe o vídeo ou compartilhe diretamente com a pessoa amada.
                </p>

                <div className="space-y-4">
                  {/* Botão de download */}
                  <a
                    href={videoData.videoUrl}
                    download
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-normal text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span>Baixar Vídeo</span>
                  </a>

                  {/* Botão de compartilhamento */}
                  <button
                    onClick={handleShare}
                    className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-normal text-base transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                  >
                    <Share2 className="h-5 w-5 text-primary" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
