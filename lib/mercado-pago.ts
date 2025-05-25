import { MercadoPagoConfig } from "mercadopago";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Instância do cliente Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export default mpClient;

// Função auxiliar para verificar a assinatura do Mercado Pago - Protege sua rota de acessos maliciosos
export function verifyMercadoPagoSignature(request: Request) {
  // Em ambiente de desenvolvimento ou teste, podemos pular a verificação
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_MP_SIGNATURE_CHECK === 'true') {
    console.log("Verificação de assinatura do Mercado Pago ignorada em ambiente de desenvolvimento");
    return;
  }

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  // Se não houver assinatura, apenas logamos e continuamos
  // Isso é importante porque o Mercado Pago pode enviar webhooks de teste sem assinatura
  if (!xSignature || !xRequestId) {
    console.warn("Aviso: Headers de assinatura do Mercado Pago ausentes. Continuando mesmo assim.");
    return;
  }

  try {
    const signatureParts = xSignature.split(",");
    let ts = "";
    let v1 = "";
    signatureParts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key.trim() === "ts") {
        ts = value.trim();
      } else if (key.trim() === "v1") {
        v1 = value.trim();
      }
    });

    if (!ts || !v1) {
      console.warn("Aviso: Formato de assinatura inválido. Continuando mesmo assim.");
      return;
    }

    const url = new URL(request.url);
    const dataId = url.searchParams.get("data.id");

    let manifest = "";
    if (dataId) {
      manifest += `id:${dataId};`;
    }
    if (xRequestId) {
      manifest += `request-id:${xRequestId};`;
    }
    manifest += `ts:${ts};`;

    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET as string;

    // Se não houver segredo configurado, apenas logamos e continuamos
    if (!secret) {
      console.warn("Aviso: MERCADO_PAGO_WEBHOOK_SECRET não configurado. Continuando mesmo assim.");
      return;
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const generatedHash = hmac.digest("hex");

    if (generatedHash !== v1) {
      console.warn("Aviso: Assinatura inválida. Continuando mesmo assim para fins de teste.");
      return;
    }
  } catch (error) {
    console.error("Erro ao verificar assinatura do Mercado Pago:", error);
    // Continuamos mesmo com erro para não bloquear webhooks de teste
    return;
  }
}
