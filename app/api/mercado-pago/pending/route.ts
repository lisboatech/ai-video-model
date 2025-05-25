import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "../../../../lib/mercado-pago";

export async function GET(request: Request) {
  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const { searchParams } = new URL(request.url);

  // Pegamos o ID do pagamento no Mercado Pago
  const paymentId = searchParams.get("payment_id");

  // Pegamos o ID do pagamento do nosso sistema
  const experienceId = searchParams.get("external_reference");

  // Pegamos o status do pagamento (se disponível)
  const status = searchParams.get("status");

  console.log("Redirecionamento de pagamento recebido:", {
    paymentId,
    experienceId,
    status,
    allParams: Object.fromEntries(searchParams.entries())
  });

  if (!experienceId) {
    console.error("ID da experiência não fornecido");
    return NextResponse.json({ error: "ID da experiência não fornecido" }, { status: 400 });
  }

  // Se não temos o ID do pagamento, redirecionamos com base no status fornecido
  if (!paymentId) {
    if (status === "approved") {
      console.log("Redirecionando para página de download (status aprovado sem paymentId)");
      return NextResponse.redirect(new URL(`/workspace/view-experience/${experienceId}/download?status=approved`, request.url));
    } else {
      console.log("Redirecionando para página da experiência (status não aprovado sem paymentId)");
      return NextResponse.redirect(new URL(`/workspace/view-experience/${experienceId}?status=${status || 'pending'}`, request.url));
    }
  }

  try {
    // Consultar o status do pagamento no Mercado Pago
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    console.log(`Pagamento ${paymentId} consultado:`, {
      status: paymentData.status,
      date_approved: paymentData.date_approved,
      external_reference: paymentData.external_reference
    });

    // Verificar se o pagamento foi aprovado
    if (paymentData.status === "approved" || paymentData.date_approved !== null) {
      // Processar o pagamento aprovado
      const { handleMercadoPagoPayment } = await import("../../../../server/mercado-pago/handle-payment");
      await handleMercadoPagoPayment(paymentData);

      console.log(`Pagamento ${paymentId} processado com sucesso. Redirecionando para página de download.`);
      // Redirecionar para a nova página de download simplificada com o mesmo design da prévia
      return NextResponse.redirect(new URL(`/download/${experienceId}`, request.url));
    }

    // Mapear o status do Mercado Pago para nosso sistema
    let redirectStatus = "pending";

    switch (paymentData.status) {
      case "pending":
        redirectStatus = "pending";
        break;
      case "in_process":
        redirectStatus = "processing";
        break;
      case "rejected":
        redirectStatus = "failed";
        break;
      case "cancelled":
        redirectStatus = "failed";
        break;
      case "refunded":
        redirectStatus = "failed";
        break;
      default:
        redirectStatus = "pending";
    }

    console.log(`Redirecionando para página apropriada com status: ${redirectStatus}`);

    // Redirecionar com base no status
    if (redirectStatus === "failed") {
      return NextResponse.redirect(new URL(`/payment-failed/${experienceId}`, request.url));
    } else {
      // Para status pendente ou em processamento, redirecionar para a página de experiência
      return NextResponse.redirect(new URL(`/workspace/view-experience/${experienceId}?status=${redirectStatus}`, request.url));
    }
  } catch (error) {
    console.error("Erro ao processar redirecionamento de pagamento:", error);

    // Em caso de erro, redirecionar para a página de falha de pagamento
    return NextResponse.redirect(new URL(`/payment-failed/${experienceId}`, request.url));
  }
}
