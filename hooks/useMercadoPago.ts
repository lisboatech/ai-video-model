import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CheckoutData {
  experienceId: string;
  userEmail?: string;
  title?: string;
  description?: string;
  price?: number;
  successUrl?: string;
  failureUrl?: string;
}

const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    // Inicializar o SDK do Mercado Pago
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: CheckoutData) {
    try {
      // Atualizar toast de carregamento se existir, ou criar um novo
      toast.loading("Conectando ao Mercado Pago...", {
        id: "payment-toast"
      });

      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutData,
          // Valores padrão se não forem fornecidos
          title: checkoutData.title || "Mensagem Especial",
          description: checkoutData.description || "Experiência sinestésica para pessoa amada",
          price: checkoutData.price || 1.00, // R$ 1,00
          successUrl: checkoutData.successUrl || `/workspace/view-experience/${checkoutData.experienceId}/download?status=approved`,
          failureUrl: checkoutData.failureUrl || `/workspace/view-experience/${checkoutData.experienceId}?status=failed`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar checkout");
      }

      const data = await response.json();

      // Atualizar toast para indicar redirecionamento
      toast.loading("Redirecionando para o checkout seguro...", {
        id: "payment-toast"
      });

      // Criar um elemento para armazenar o estado do redirecionamento
      const redirectState = { completed: false };

      // Pequeno atraso para garantir que o usuário veja a mensagem de redirecionamento
      setTimeout(() => {
        // Redirecionar para a página de checkout do Mercado Pago
        window.location.href = data.initPoint;

        // Marcar o redirecionamento como concluído
        redirectState.completed = true;
      }, 800);

      // Verificar se o redirecionamento foi concluído após 5 segundos
      setTimeout(() => {
        if (!redirectState.completed) {
          // Se não foi redirecionado, mostrar uma mensagem de erro
          toast.error("Erro ao redirecionar para o checkout. Tente novamente.", {
            id: "payment-toast"
          });
        }
      }, 5000);
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.", {
        id: "payment-toast"
      });
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
