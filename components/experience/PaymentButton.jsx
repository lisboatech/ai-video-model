"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Download, Share2, LoaderCircle } from "lucide-react";
import useMercadoPago from "../../hooks/useMercadoPago"; //"@/hooks/useMercadoPago";
import { toast } from "sonner";

export default function PaymentButton({
  experienceId,
  userEmail,
  isDownload = true,
  isDisabled = false,
  className = "",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { createMercadoPagoCheckout } = useMercadoPago();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Mostrar toast de processamento
      toast.loading("Preparando pagamento...", {
        id: "payment-toast",
        duration: 10000 // 10 segundos
      });

      // Criar checkout do Mercado Pago
      await createMercadoPagoCheckout({
        experienceId,
        userEmail,
        title: "Mensagem Especial",
        description: "Experiência sinestésica para pessoa amada",
        price: 1.00, // R$ 1,00
        successUrl: isDownload
          ? `/workspace/view-experience/${experienceId}/download?status=approved`
          : `/workspace/view-experience/${experienceId}?status=approved&share=true`,
        failureUrl: `/workspace/view-experience/${experienceId}?status=failed`
      });

      // O toast será fechado automaticamente quando o usuário for redirecionado

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.", {
        id: "payment-toast"
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || isDisabled}
      className={`rounded-full px-6 py-6 text-base font-light bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 ${className}`}
    >
      {isLoading ? (
        <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
      ) : isDownload ? (
        <Download className="w-5 h-5 mr-2" />
      ) : (
        <Share2 className="w-5 h-5 mr-2" />
      )}
      <span>{isDownload ? "Baixar Experiência" : "Compartilhar"}</span>
    </Button>
  );
}
