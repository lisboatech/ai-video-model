import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Cliente Convex para atualizar o banco de dados
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

/**
 * Processa o pagamento do Mercado Pago e retorna a URL para redirecionamento
 * Fluxo simplificado para MVP: redireciona diretamente para a página de download
 */
export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    const experienceId = paymentData.external_reference;
    if (!experienceId) {
      console.error("ID da experiência não encontrado no pagamento:", paymentData.id);
      return { success: false, message: "ID da experiência não encontrado" };
    }
    const convexExperienceId = experienceId as Id<"videoData">;

    // Atualizar o status de pagamento no banco de dados (opcional para MVP)
    // Isso é útil para análises futuras, mas não é essencial para o fluxo principal
    try {
      await convex.mutation(api.videoData.updatePaymentStatus, {
        videoId: convexExperienceId,
        status: "paid",
        paymentId: paymentData.id.toString(),
      });
      console.log(`Status de pagamento atualizado para: paid`);
    } catch (error) {
      // Não interromper o fluxo se a atualização do banco de dados falhar
      console.error("Erro ao atualizar status de pagamento:", error);
    }

    // Redirecionar para a página de download simplificada com o mesmo design da prévia
    return {
      success: true,
      redirectUrl: `/download/${experienceId}`,
      message: "Pagamento aprovado! Redirecionando para o download do vídeo."
    };
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return {
      success: false,
      message: "Erro ao processar pagamento. Por favor, tente novamente."
    };
  }
}
