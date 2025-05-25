"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Header from '../../workspace/[video_id]/_components/Header';
import PaymentButton from '../../../components/PaymentButton';

export default function PaymentFailedPage() {
  const { video_id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const result = await convex.query(api.videoData.GetVideoDataById, {
          vid: video_id
        });

        if (result) {
          setVideoData(result);

          // Se o vídeo já estiver pago, redirecionar para a página de download
          if (result.paymentStatus === 'paid') {
            router.push(`/download/${video_id}`);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do vídeo:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [video_id, convex, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-red-500/20 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-white mb-2">
              Pagamento não <span className="font-normal">concluído</span>
            </h1>
            <p className="text-white/70">
              Houve um problema com o seu pagamento. Por favor, tente novamente.
            </p>
          </div>

          <div className="space-y-6">
            <PaymentButton
              videoId={video_id}
              userEmail={videoData?.userEmail || ''}
              className="w-full"
            />

            <button
              onClick={() => router.push(`/workspace/view-experience/${video_id}`)}
              className="w-full bg-black/40 hover:bg-black/50 text-white/80 font-medium py-3 px-8 rounded-xl transition-all duration-300 border border-white/10"
            >
              Voltar para o vídeo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
