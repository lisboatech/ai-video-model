import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicializar o SDK do Mercado Pago
if (typeof window !== 'undefined') {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
}

/**
 * Hook para gerenciar o fluxo de pagamento simplificado para o MVP
 * Após o pagamento, o usuário é redirecionado diretamente para a página de download
 */
export default function usePaymentFlow() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Inicia o processo de pagamento
   * @param {string} videoId - ID do vídeo no banco de dados
   * @param {string} userEmail - Email do usuário (opcional)
   */
  const initiatePayment = async (videoId, userEmail = '') => {
    if (!videoId) {
      toast.error('ID do vídeo não fornecido');
      return;
    }

    setLoading(true);
    toast.loading('Preparando pagamento...', { id: 'payment-toast' });

    try {
      console.log('Iniciando pagamento para vídeo:', videoId);

      // Criar preferência de pagamento
      const response = await fetch('/api/mercado-pago/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoId, // Usar videoId em vez de experienceId para compatibilidade
          userEmail,
          price: 1.00,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resposta de erro:', errorData);
        throw new Error(errorData.error || 'Erro ao criar preferência de pagamento');
      }

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (!data.initPoint) {
        throw new Error('URL de checkout não retornada');
      }

      toast.success('Redirecionando para o pagamento...', { id: 'payment-toast' });

      // Redirecionar para a página de pagamento do Mercado Pago
      window.location.href = data.initPoint;
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      toast.error(`Erro ao processar pagamento: ${error.message}`, { id: 'payment-toast' });
      setLoading(false);
    }
  };

  return {
    loading,
    initiatePayment
  };
}
