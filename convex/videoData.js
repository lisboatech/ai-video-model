import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewVideoData = mutation({
    args: {
        topic: v.string(),
        scriptVariant: v.any(),
        sessionId: v.optional(v.string()),
        voice: v.optional(v.any()), // Adicionando o campo voice como opcional
        personalizationData: v.optional(v.any()) // Dados de personalização do formulário
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('videoData', {
            topic: args.topic,
            scriptVariant: args.scriptVariant,
            sessionId: args.sessionId, // Armazenar o ID da sessão
            voice: args.voice, // Incluir o campo voice se fornecido
            personalizationData: args.personalizationData, // Dados de personalização
            paymentStatus: "pending",
            status: 1
        })

        return result; // Record ID
    }
})


export const GetVideoDataById = query({
    args: {
        vid: v.id('videoData')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.vid);
        return result;
    }
})


export const updateInitialVideoData = mutation({
    args: {
        topic: v.string(),
        scriptVariant: v.any(),
        script: v.optional(v.any()),
        assets: v.optional(v.any()),
        voice: v.optional(v.any()),
        voiceUrl: v.optional(v.any()),
        sessionId: v.optional(v.string()),
        videoDataRecordId: v.id('videoData'),
        status: v.optional(v.number()),
        paymentStatus: v.optional(v.string()),
        paymentId: v.optional(v.string()),
        videoUrl: v.optional(v.any())
    },
    handler: async (ctx, args) => {
        // IMPORTANTE: Esta função é usada para atualizar vários campos do vídeo
        // Certifique-se de incluir todos os campos relevantes (script, assets, etc.)
        // quando chamar esta função para evitar perda de dados

        // Criar objeto com campos obrigatórios
        const updateData = {
            topic: args.topic,
            scriptVariant: args.scriptVariant,
            status: 1,
        };

        // Adicionar campos opcionais se fornecidos
        if (args.script !== undefined) updateData.script = args.script;
        if (args.assets !== undefined) updateData.assets = args.assets;
        if (args.voice !== undefined) updateData.voice = args.voice;
        if (args.voiceUrl !== undefined) updateData.voiceUrl = args.voiceUrl;
        if (args.sessionId !== undefined) updateData.sessionId = args.sessionId;
        if (args.paymentStatus !== undefined) updateData.paymentStatus = args.paymentStatus;
        if (args.paymentId !== undefined) updateData.paymentId = args.paymentId;
        if (args.videoUrl !== undefined) updateData.videoUrl = args.videoUrl;



        console.log("Atualizando dados:", updateData);
        const result = await ctx.db.patch(args.videoDataRecordId, updateData);
        return result;
    }
})


export const UpdateVideoStatus = mutation({
    args: {
        videoId: v.id('videoData'),
        status: v.number()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.videoId,
            {
                status: args.status
            }
        )

        return result;
    }
})


export const GetAllVideos = query({
    args: {},
    handler: async (ctx) => {
        const result = await ctx.db.query('videoData')
            .order('desc')
            .collect();

        return result;
    }
})


export const GetVideosBySessionId = query({
    args: {
        sessionId: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('videoData')
            .filter(q => q.eq(q.field('sessionId'), args.sessionId))
            .order('desc')
            .collect();

        return result;
    }
})

export const updateRenderedVideoUrl = mutation({
    args: {
        videoDataRecordId: v.id('videoData'),
        renderedVideoUrl: v.string(),
        videoInfo: v.optional(v.any())
    },
    handler: async (ctx, args) => {
        // Obter o registro atual para preservar o status de pagamento
        const currentRecord = await ctx.db.get(args.videoDataRecordId);

        const updateData = {
            // Armazenar a URL do vídeo renderizado
            videoUrl: args.renderedVideoUrl,
            // Atualizar o status para indicar que o vídeo foi renderizado
            status: 3, // Status 3 = vídeo renderizado
            // NÃO alterar o status de pagamento - manter como estava
            // O status de pagamento só deve ser alterado após o pagamento real
        };

        console.log("Atualizando dados do vídeo:", {
            videoDataRecordId: args.videoDataRecordId,
            videoUrl: args.renderedVideoUrl,
            status: 3,
            paymentStatus: currentRecord.paymentStatus || "pending" // Mostrar o status atual para debug
        });

        const result = await ctx.db.patch(args.videoDataRecordId, updateData);

        return result;
    }
})

export const UpdateVoiceUrl = mutation({
    args: {
        vId: v.id('videoData'),
        voiceUrl: v.string()
    },
    handler: async (ctx, args) => {
        console.log("Atualizando URL da voz:", {
            videoDataRecordId: args.vId,
            voiceUrl: args.voiceUrl
        });

        // Verificar se o registro existe
        const existingRecord = await ctx.db.get(args.vId);
        console.log("Registro existente:", existingRecord);

        // Atualizar o registro com a URL da voz
        const result = await ctx.db.patch(args.vId, {
            voiceUrl: args.voiceUrl
        });
        console.log("Resultado da atualização:", result);

        // Verificar se a atualização foi bem-sucedida
        const updatedRecord = await ctx.db.get(args.vId);
        console.log("Registro atualizado:", {
            id: updatedRecord._id,
            voiceUrl: updatedRecord.voiceUrl
        });

        return result;
    }
})

// Atualizar o status de pagamento de um vídeo
export const updatePaymentStatus = mutation({
    args: {
        videoId: v.string(), // _id do vídeo
        status: v.string(),
        paymentId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingRecord = await ctx.db.get(args.videoId);
        if (!existingRecord) throw new Error(`Vídeo não encontrado com ID: ${args.videoId}`);

        const updateData = { paymentStatus: args.status };
        if (args.paymentId) updateData.paymentId = args.paymentId;

        await ctx.db.patch(existingRecord._id, updateData);
        return { success: true };
    },
})