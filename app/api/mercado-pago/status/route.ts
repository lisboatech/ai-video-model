import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Payment } from "mercadopago";
import mpClient from "../../../../lib/mercado-pago";

// Cliente Convex para consultar o banco de dados
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

// Configuração de CORS para a API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Função para lidar com requisições OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders, status: 200 });
}

/**
 * Rota para verificar o status de um pagamento no Mercado Pago
 * Funciona silenciosamente no backend para atualizar o banco de dados
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Verificar se temos um ID de experiência
    const experienceId = searchParams.get("experienceId");
    
    if (!experienceId) {
      return NextResponse.json(
        { error: "Você deve fornecer experienceId" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log(`Verificando status de pagamento para experiência: ${experienceId}`);
    
    // Buscar dados do vídeo no banco de dados
    const videoData = await convex.query(api.videoData.GetVideoDataById, {
      vid: experienceId
    });
    
    if (!videoData) {
      return NextResponse.json(
        { error: "Experiência não encontrada" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Se já está pago, retornar status atual
    if (videoData.paymentStatus === "approved" || videoData.paymentStatus === "paid") {
      console.log(`Pagamento já aprovado para experiência: ${experienceId}`);
      return NextResponse.json({
        experienceId,
        status: "approved",
        internalStatus: "paid",
        isApproved: true,
        paymentId: videoData.paymentId || null
      }, { headers: corsHeaders });
    }
    
    // Se temos um paymentId, verificar no Mercado Pago
    if (videoData.paymentId) {
      try {
        console.log(`Verificando pagamento ${videoData.paymentId} no Mercado Pago`);
        
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: videoData.paymentId });
        
        console.log(`Status do pagamento no Mercado Pago: ${paymentData.status}`);
        
        // Se o pagamento foi aprovado no Mercado Pago, atualizar no banco
        if (paymentData.status === "approved") {
          console.log(`Atualizando status para 'paid' no banco de dados`);
          
          try {
            await convex.mutation(api.videoData.updatePaymentStatus, {
              videoId: experienceId,
              status: "paid",
              paymentId: videoData.paymentId
            });
            
            console.log(`Status atualizado com sucesso`);
          } catch (updateError) {
            console.error("Erro ao atualizar status com updatePaymentStatus, tentando método alternativo:", updateError);
            
            // Método alternativo
            await convex.mutation(api.videoData.updateInitialVideoData, {
              videoDataRecordId: experienceId,
              topic: videoData.topic || "amor incondicional",
              scriptVariant: videoData.scriptVariant,
              paymentStatus: "paid"
            });
            
            console.log(`Status atualizado com método alternativo`);
          }
          
          return NextResponse.json({
            experienceId,
            status: "approved",
            internalStatus: "paid",
            isApproved: true,
            paymentId: videoData.paymentId,
            updated: true
          }, { headers: corsHeaders });
        }
        
        // Retornar status atual do Mercado Pago
        return NextResponse.json({
          experienceId,
          status: paymentData.status,
          internalStatus: paymentData.status,
          isApproved: paymentData.status === "approved",
          paymentId: videoData.paymentId
        }, { headers: corsHeaders });
        
      } catch (mpError) {
        console.error("Erro ao verificar pagamento no Mercado Pago:", mpError);
        // Continuar com verificação local se falhar
      }
    }
    
    // Verificação baseada apenas no banco de dados
    const isApproved = videoData.paymentStatus === "approved" || videoData.paymentStatus === "paid";
    
    const result = {
      experienceId,
      status: videoData.paymentStatus || "pending",
      internalStatus: isApproved ? "paid" : videoData.paymentStatus || "pending",
      isApproved,
      paymentId: videoData.paymentId || null
    };
    
    console.log(`Resultado da verificação:`, result);
    
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao verificar pagamento" },
      { status: 500, headers: corsHeaders }
    );
  }
}
