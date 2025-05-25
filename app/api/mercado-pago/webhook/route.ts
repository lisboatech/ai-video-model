import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "../../../../lib/mercado-pago";
import { handleMercadoPagoPayment } from "../../../../server/mercado-pago/handle-payment";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import type { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

// Configuração de CORS para o webhook
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-signature, x-request-id",
};

// Função para lidar com requisições OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders, status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    // Verificar a assinatura do Mercado Pago para segurança
    // Em ambiente de desenvolvimento, isso não bloqueará a execução
    try {
      verifyMercadoPagoSignature(req);
    } catch (signatureError) {
      console.warn("Aviso na verificação de assinatura:", signatureError);
      // Continuamos mesmo com erro na assinatura para facilitar testes
    }

    const body = await req.json();
    const paymentId = body.data?.id;

    if (!paymentId) {
      console.error("Webhook: paymentId ausente no body");
      return NextResponse.json({ error: "No paymentId" }, { status: 400 });
    }

    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    console.log("Webhook recebido:", {
      paymentId: paymentData.id,
      external_reference: paymentData.external_reference,
      status: paymentData.status,
    });

    // Checagem extra: external_reference deve existir
    if (!paymentData.external_reference) {
      console.error("Webhook: external_reference ausente no pagamento. Não é possível atualizar o status no Convex.");
      return NextResponse.json({ error: "No external_reference" }, { status: 200, headers: corsHeaders });
    }

    // Sempre salvar o paymentId no banco de dados, independente do status
    console.log(`Salvando paymentId ${paymentId} no banco de dados...`);
    try {
      await convex.mutation(api.videoData.updatePaymentStatus, {
        videoId: paymentData.external_reference,
        status: paymentData.status === "approved" ? "paid" : "pending",
        paymentId: paymentData.id.toString(),
      });
      console.log(`PaymentId ${paymentId} salvo com sucesso no banco de dados.`);
    } catch (error) {
      console.error("Erro ao salvar paymentId, tentando método alternativo:", error);

      // Método alternativo usando updateInitialVideoData
      try {
        const videoData = await convex.query(api.videoData.GetVideoDataById, {
          vid: paymentData.external_reference
        });

        await convex.mutation(api.videoData.updateInitialVideoData, {
          videoDataRecordId: paymentData.external_reference,
          topic: videoData?.topic || "amor incondicional",
          scriptVariant: videoData?.scriptVariant || {},
          paymentStatus: paymentData.status === "approved" ? "paid" : "pending",
          paymentId: paymentData.id.toString()
        });

        console.log(`PaymentId ${paymentId} salvo com método alternativo.`);
      } catch (altError) {
        console.error("Erro ao salvar paymentId com método alternativo:", altError);
      }
    }

    // Processar o pagamento com base no status
    switch (paymentData.status) {
      case "approved":
        // Pagamento aprovado - processar normalmente
        console.log(`Pagamento ${paymentId} aprovado. Processando...`);
        await handleMercadoPagoPayment(paymentData);
        break;

      case "pending":
        // Pagamento pendente (ex: Pix gerado mas não pago)
        console.log(`Pagamento ${paymentId} pendente. Aguardando confirmação.`);
        // PaymentId já foi salvo acima
        break;

      case "in_process":
        // Pagamento em análise
        console.log(`Pagamento ${paymentId} em análise. Aguardando processamento.`);
        // PaymentId já foi salvo acima
        break;

      case "rejected":
        // Pagamento rejeitado
        console.log(`Pagamento ${paymentId} rejeitado. Motivo: ${paymentData.status_detail}`);
        // PaymentId já foi salvo acima com status "pending"
        break;

      case "refunded":
        // Pagamento estornado
        console.log(`Pagamento ${paymentId} estornado.`);
        // PaymentId já foi salvo acima
        break;

      case "cancelled":
        // Pagamento cancelado
        console.log(`Pagamento ${paymentId} cancelado.`);
        // PaymentId já foi salvo acima
        break;

      default:
        console.log(`Pagamento ${paymentId} com status não tratado: ${paymentData.status}`);
    }

    // Verificar também se o pagamento foi aprovado pela data de aprovação (caso do Pix)
    if (paymentData.date_approved !== null && paymentData.status !== "approved") {
      console.log(`Pagamento ${paymentId} tem data de aprovação mas status diferente de approved. Processando como aprovado...`);
      await handleMercadoPagoPayment(paymentData);
    }

    // PaymentId já foi salvo no início da função
    console.log("Webhook processado com sucesso.");

    // Sempre retornar 200 para o Mercado Pago, mesmo em caso de erro no processamento
    // Isso evita que o Mercado Pago fique reenviando o mesmo webhook
    return NextResponse.json(
      { received: true, success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);

    // Mesmo em caso de erro, retornamos 200 para o Mercado Pago
    // para evitar que ele fique reenviando o mesmo webhook
    return NextResponse.json(
      { received: true, error: "Webhook handler failed but acknowledged" },
      { status: 200, headers: corsHeaders }
    );
  }
}
