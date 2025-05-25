import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "../../../../lib/mercado-pago";

export async function POST(req: NextRequest) {
  const { videoId, userEmail, price } = await req.json();

  // Log para depuração
  console.log("Criando preferência Mercado Pago com external_reference:", videoId);

  const preference = new Preference(mpClient);

  const createdPreference = await preference.create({
    body: {
      external_reference: videoId, // _id do vídeo no Convex
      payer: { email: userEmail },
      items: [
        {
          id: "video", // pode ser qualquer string, mas é obrigatório
          title: "Vídeo Especial",
          unit_price: price,
          quantity: 1,
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/download/${videoId}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed/${videoId}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending?external_reference=${videoId}`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook`,
    },
  });

  return NextResponse.json({
    preferenceId: createdPreference.id,
    initPoint: createdPreference.init_point,
  });
}
