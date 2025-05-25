import { useState } from 'react';
import usePaymentFlow from '../hooks/usePaymentFlow';

export default function PaymentButton({ videoId, userEmail, className = '' }) {
  const { loading, initiatePayment } = usePaymentFlow();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    await initiatePayment(videoId, userEmail);
    setIsProcessing(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || isProcessing}
      className={`bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
    >
      {loading || isProcessing ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Pagar e Baixar Vídeo
        </>
      )}
    </button>
  );
}
