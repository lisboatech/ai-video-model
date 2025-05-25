import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "../../../../lib/mercado-pago";

/**
 * Rota para criar uma preferência de pagamento no Mercado Pago
 * Fluxo simplificado para MVP: após o pagamento, redireciona para a página de download
 */
export async function POST(req) {
  try {
    const { 
      experienceId, 
      userEmail, 
      title = "Vídeo personalizado",
      description = "Acesso ao seu vídeo personalizado",
      price = 1.00,
      successUrl,
      failureUrl
    } = await req.json();

    if (!experienceId) {
      return NextResponse.json(
        { error: "ID da experiência não fornecido" },
        { status: 400 }
      );
    }

    // Log para depuração
    console.log("Criando preferência Mercado Pago:", {
      experienceId,
      userEmail,
      price
    });

    const preference = new Preference(mpClient);

    // URLs de retorno padrão (caso não sejam fornecidas)
    const defaultSuccessUrl = `/download/${experienceId}`;
    const defaultFailureUrl = `/payment-failed/${experienceId}`;

    // Criar a preferência de pagamento
    const createdPreference = await preference.create({
      body: {
        external_reference: experienceId, // ID do vídeo no banco de dados
        payer: { email: userEmail || "cliente@exemplo.com" },
        items: [
          {
            id: "video", // Identificador do item (pode ser qualquer string)
            title: title,
            description: description,
            unit_price: price,
            quantity: 1,
            currency_id: "BRL"
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}${successUrl || defaultSuccessUrl}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}${failureUrl || defaultFailureUrl}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending?external_reference=${experienceId}`
        },
        auto_return: "approved", // Redirecionar automaticamente após pagamento aprovado
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook`,
        statement_descriptor: "Buteco Raiz", // Nome que aparecerá na fatura do cartão
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      }
    });

    console.log("Preferência criada com sucesso:", {
      id: createdPreference.id,
      initPoint: createdPreference.init_point
    });

    // Retornar os dados da preferência
    return NextResponse.json({
      success: true,
      preferenceId: createdPreference.id,
      checkoutUrl: createdPreference.init_point
    });
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Erro ao criar preferência de pagamento",
        details: error.message
      },
      { status: 500 }
    );
  }
}
