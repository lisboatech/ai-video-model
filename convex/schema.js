import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Define your tables here.
    videoData: defineTable({
        topic: v.string(),
        scriptVariant: v.any(),
        script: v.optional(v.any()),
        assets: v.optional(v.any()),
        voice: v.optional(v.any()),
        voiceUrl: v.optional(v.any()),
        videoUrl: v.optional(v.any()),
        status: v.optional(v.number()), //1. pending 2. completed 3. rendering  4. ready to download
        paymentStatus: v.optional(v.string()), // "pending", "paid", "failed"
        paymentId: v.optional(v.string()), // ID do pagamento
        sessionId: v.optional(v.string()), // ID da sessão do usuário
        personalizationData: v.optional(v.any()) // Dados de personalização do formulário
    })
});
