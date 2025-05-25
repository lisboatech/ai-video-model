"use client"
import { useConvex, useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api';
import axios from 'axios';
import { toast } from 'sonner';

// Componentes
import MainContent from './_components/MainContent';
import PreviewSection from './_components/PreviewSection';
import { VoiceProvider } from './_components/VoiceContext';
import Link from 'next/link';

export function MothersDay() {
    const { video_id } = useParams();
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewUpdateTimeout, setPreviewUpdateTimeout] = useState(null);
    const [saveTimeout, setSaveTimeout] = useState(null);
    const createVideoDataEntry = useMutation(api.videoData.updateInitialVideoData);
    const router = useRouter();
    const convex = useConvex();

    useEffect(() => {
        if (!localStorage.getItem('sessionId')) {
            localStorage.setItem('sessionId', Date.now().toString());
        }

        GetVideoData();
    }, [])

    // Cleanup dos timeouts quando o componente for desmontado
    useEffect(() => {
        return () => {
            if (previewUpdateTimeout) {
                clearTimeout(previewUpdateTimeout);
            }
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
        };
    }, [previewUpdateTimeout, saveTimeout]);

    const GetVideoData = async () => {
        const result = await convex.query(api.videoData.GetVideoDataById, {
            vid: video_id
        });
        console.log(result);
        setVideoData(result);
    }

    const onHandleInputChange = (name, value) => {
        console.log(`Atualizando ${name}:`, value);

        setVideoData(prev => {
            const newState = {
                ...prev,
                [name]: value
            };

            if (name === 'voice') {
                console.log('Voz alterada, limpando voiceUrl');
                newState.voiceUrl = null;
            }

            return newState;
        });

        // Atualizar prévia APENAS quando fotos/assets mudarem
        if (['assets', 'rawFiles'].includes(name)) {
            // Limpar timeout anterior se existir
            if (previewUpdateTimeout) {
                clearTimeout(previewUpdateTimeout);
            }

            const newTimeout = setTimeout(() => {
                setPreviewKey(prev => prev + 1);
                setPreviewUpdateTimeout(null);
            }, 100);

            setPreviewUpdateTimeout(newTimeout);
        }

        // Salvar no banco de dados com debounce para script e assets
        if (['script', 'assets'].includes(name) && value) {
            console.log(`Agendando salvamento de ${name} no banco de dados:`, value);

            // Limpar timeout anterior se existir
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }

            // Para script, usar debounce mais longo para evitar muitas chamadas
            const saveDelay = name === 'script' ? 2000 : 500;

            const newSaveTimeout = setTimeout(async () => {
                try {
                    console.log(`Salvando ${name} no banco de dados:`, value);
                    const currentData = await convex.query(api.videoData.GetVideoDataById, {
                        vid: video_id
                    });

                    const updateData = {
                        videoDataRecordId: video_id,
                        topic: currentData.topic || "amor",
                        scriptVariant: currentData.scriptVariant
                    };

                    // Adicionar o campo específico que está sendo atualizado
                    updateData[name] = value;

                    await createVideoDataEntry(updateData);
                    console.log(`${name} salvo no banco de dados com sucesso`);
                    setSaveTimeout(null);
                } catch (error) {
                    console.error(`Erro ao salvar ${name} no banco de dados:`, error);
                }
            }, saveDelay);

            setSaveTimeout(newSaveTimeout);
        }

        if (name === 'voiceUrl' && value) {
            console.log('Salvando voiceUrl no banco de dados:', value);

            setTimeout(async () => {
                try {
                    const currentData = await convex.query(api.videoData.GetVideoDataById, {
                        vid: video_id
                    });

                    await createVideoDataEntry({
                        videoDataRecordId: video_id,
                        topic: currentData.topic || "amor",
                        scriptVariant: currentData.scriptVariant,
                        voiceUrl: value
                    });
                    console.log('voiceUrl salvo no banco de dados com sucesso');
                } catch (error) {
                    console.error('Erro ao salvar voiceUrl no banco de dados:', error);
                }
            }, 100);
        }
    }

    const GenerateVideo = async () => {
        if (!videoData?.script) {
            toast.error('Por favor, adicione uma mensagem');
            return;
        }

        if (!videoData?.voice?._id) {
            toast.error('Por favor, selecione uma voz');
            return;
        }

        if (!videoData?.rawFiles || videoData.rawFiles.length === 0) {
            toast.error('Por favor, adicione pelo menos uma foto');
            return;
        }

        setLoading(true);
        toast.loading("Estamos processando seu vídeo. Isso pode levar alguns minutos...");

        try {
            let uploadedFiles = [];

            if (videoData.rawFiles && videoData.rawFiles.length > 0) {
                const uploadPromises = videoData.rawFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('fileName', `mothers_day_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`);
                    formData.append('folder', 'mothers-day-experiences');

                    const response = await fetch('/api/upload-image', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Falha ao fazer upload da imagem');
                    }

                    const data = await response.json();
                    return data.url;
                });

                uploadedFiles = await Promise.all(uploadPromises);
                console.log("Imagens enviadas para ImageKit:", uploadedFiles);
                onHandleInputChange('assets', uploadedFiles);
            }

            if (!videoData?.voice) {
                console.error("Nenhuma voz selecionada");
                toast.error("Por favor, selecione uma voz para narração");
                throw new Error("Nenhuma voz selecionada");
            }

            // Determinar qual API usar baseado no provider da voz
            const isElevenLabsVoice = videoData.voice?.provider === 'elevenlabs';
            const apiEndpoint = isElevenLabsVoice ? '/api/create-voice-elevenlabs' : '/api/create-voice';

            console.log(`🎙️ Usando ${isElevenLabsVoice ? 'ElevenLabs' : 'Akool'} para geração de voz`);
            console.log("Voz selecionada:", videoData.voice);

            // Validação específica por provider
            if (!isElevenLabsVoice && !videoData.voice.voice_id) {
                console.error("Voice ID não encontrado na voz Akool selecionada:", videoData.voice);
                toast.error("A voz selecionada não é válida. Por favor, selecione outra voz.");
                throw new Error("Voice ID não encontrado na voz selecionada");
            }

            try {
                // Preparar dados baseado no provider
                const requestData = isElevenLabsVoice
                    ? {
                        script: videoData?.script,
                        voiceType: videoData?.voice?.voiceType || 'female',
                        videoRecordId: video_id
                      }
                    : {
                        script: videoData?.script,
                        voiceId: videoData?.voice,
                        videoRecordId: video_id
                      };

                const result = await axios.post(apiEndpoint, requestData);

                console.log(`Resposta da API de voz (${isElevenLabsVoice ? 'ElevenLabs' : 'Akool'}):`, result.data);

                if (!result.data.success && result.data.error) {
                    console.error("Erro na geração de voz:", result.data.error);
                    toast.error(`Erro na geração de voz: ${result.data.error}`);
                    throw new Error(result.data.error);
                }

                let finalVoiceUrl = result.data?.audioUrl;

                if (result.data?.processing) {
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    const updatedData = await convex.query(api.videoData.GetVideoDataById, {
                        vid: video_id
                    });

                    if (updatedData.voiceUrl) {
                        console.log("Usando voiceUrl do banco de dados:", updatedData.voiceUrl);
                        finalVoiceUrl = updatedData.voiceUrl;
                    } else {
                        console.log("voiceUrl ainda não disponível no banco de dados, usando prévia da voz como fallback");
                        finalVoiceUrl = videoData?.voice?.preview;
                    }
                }

                const renderResponse = await fetch('/api/render-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        experienceId: video_id,
                        videoInfo: {
                            script: videoData.script,
                            assets: uploadedFiles,
                            voiceUrl: finalVoiceUrl,
                            voice: {
                                ...videoData.voice,
                                gifNumber: videoData.voice.gifNumber || 1
                            }
                        }
                    }),
                });

                if (!renderResponse.ok) {
                    throw new Error(`Erro ao iniciar renderização: ${renderResponse.statusText}`);
                }

                const renderResult = await renderResponse.json();

                if (!renderResult.success) {
                    throw new Error(renderResult.error || 'Erro desconhecido na renderização');
                }

                await createVideoDataEntry({
                    videoDataRecordId: video_id,
                    topic: videoData.topic,
                    scriptVariant: videoData.scriptVariant,
                    script: videoData.script,
                    assets: uploadedFiles,
                    voiceUrl: finalVoiceUrl,
                    voice: videoData.voice,
                    paymentStatus: "pending"
                });

                toast.success("Seu vídeo foi processado com sucesso!");
                router.replace(`/workspace/view-experience/${video_id}`);
            } catch (error) {
                console.error("Erro na geração de voz:", error);
                throw error;
            }
        } catch (error) {
            console.error("Erro ao processar vídeo:", error);
            toast.error(`Não foi possível processar o vídeo: ${error.message}`);
            router.replace(`/workspace/view-experience/${video_id}`);
        } finally {
            setLoading(false);
            toast.dismiss();
        }
    }

    return (
        <VoiceProvider>
            <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
                {/* Background effects - Dark theme */}
                <div className="absolute inset-0 bg-black z-0"></div>

                {/* Efeito de grade futurista */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 z-0"></div>

                {/* Subtle gradients with primary color */}
                <div className="absolute top-0 right-0 w-full h-full opacity-20 z-0">
                    <div className="absolute top-0 right-0 w-[60%] h-[50%] bg-primary/10 rounded-full blur-[180px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-primary/5 rounded-full blur-[180px] animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow animation-delay-1000"></div>
                </div>

                {/* Light effects */}
                <div className="absolute top-[20%] right-[15%] h-0 w-[20rem] shadow-[0_0_500px_15px_rgba(220,38,38,0.1)] -rotate-[30deg] z-0"></div>
                <div className="absolute bottom-[30%] left-[10%] h-0 w-[15rem] shadow-[0_0_400px_10px_rgba(220,38,38,0.05)] rotate-[20deg] z-0"></div>

                {/* Header with back button - Apple style */}
                <div className="w-full p-4 sm:p-6 z-50 absolute top-0 left-0">
                    <Link href="/workspace" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        <span className="text-base font-normal">Voltar</span>
                    </Link>
                </div>

                {/* Main content container - centralizado */}
                <div className="flex-1 flex items-start sm:items-center justify-center min-h-screen py-4 sm:py-8 pt-16 sm:pt-8">
                    <div className="container mx-auto px-4 sm:px-6 z-10 max-w-4xl w-full">
                        <MainContent
                            videoData={videoData}
                            onHandleInputChange={onHandleInputChange}
                            loading={loading}
                            onGenerateVideo={GenerateVideo}
                        />
                    </div>
                </div>
            </div>
        </VoiceProvider>
    )
}

export default MothersDay
