"use client"
import React, { useEffect, useState, use } from 'react'
import { useConvex } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

import { toast } from 'sonner'

// Componentes
import Header from './_components/Header'
import LoadingState from './_components/LoadingState'
import ProcessingState from './_components/ProcessingState'
import VideoPreview from './_components/VideoPreview'
import ExperienceInfo from './_components/ExperienceInfo'

function ViewExperience({ params }) {
    const unwrappedParams = use(params)
    const experience_id = unwrappedParams.experience_id
    const [experienceData, setExperienceData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [videoUrl, setVideoUrl] = useState(null)
    const [renderingVideo, setRenderingVideo] = useState(false)

    const convex = useConvex()

    useEffect(() => {
        getExperienceData()
    }, [])

    // Verificação silenciosa de pagamento (não afeta o frontend)
    useEffect(() => {
        if (!experienceData) return;

        // Se o pagamento ainda está pendente, verificar silenciosamente
        if (experienceData.paymentStatus === 'pending' && experienceData.paymentId) {
            console.log('Verificando status de pagamento silenciosamente...');

            const checkPaymentSilently = async () => {
                try {
                    const response = await fetch(`/api/mercado-pago/status?experienceId=${experience_id}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Resultado da verificação silenciosa:', data);

                        // Se o pagamento foi aprovado, recarregar os dados
                        if (data.isApproved && data.updated) {
                            console.log('Pagamento aprovado! Recarregando dados...');
                            setTimeout(() => {
                                getExperienceData();
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error('Erro na verificação silenciosa:', error);
                }
            };

            // Verificar imediatamente
            checkPaymentSilently();

            // Verificar a cada 30 segundos (menos frequente que antes)
            const interval = setInterval(checkPaymentSilently, 30000);

            return () => clearInterval(interval);
        }
    }, [experienceData, experience_id]);



    const getExperienceData = async () => {
        try {
            const result = await convex.query(api.videoData.GetVideoDataById, {
                vid: experience_id
            })
            console.log("Dados da experiência:", result)

            if (result && result.voice && !result.voice.backgroundMusic) {
                result.voice.backgroundMusic = 'emocional';
            }

            if (result && (!result.assets || result.assets.length === 0)) {
                console.log("Adicionando imagem de exemplo")
                result.assets = ['/placeholder-image.jpg'];
            }

            if (result?.videoUrl) {
                console.log("Usando videoUrl:", result.videoUrl);
                setVideoUrl(result.videoUrl);
            } else if (result?.renderedVideoUrl) {
                console.log("Usando renderedVideoUrl:", result.renderedVideoUrl);
                setVideoUrl(result.renderedVideoUrl);
            }

            if (!result.paymentStatus) {
                console.log("Definindo paymentStatus como 'pending'");
                await convex.mutation(api.videoData.updateInitialVideoData, {
                    videoDataRecordId: experience_id,
                    topic: result.topic || "amor incondicional",
                    scriptVariant: result.scriptVariant,
                    paymentStatus: "pending"
                });

                result.paymentStatus = "pending";
            }

            if (!result.status || result.status < 3) {
                console.log("Atualizando status para 3 (vídeo renderizado)");
                await convex.mutation(api.videoData.UpdateVideoStatus, {
                    videoId: experience_id,
                    status: 3
                });

                result.status = 3;
            }

            if ((result?.paymentStatus === "approved" || result?.paymentStatus === "paid") &&
                !result?.videoUrl && !result?.renderedVideoUrl) {
                console.log("Status de pagamento é 'approved' ou 'paid' mas não há vídeo renderizado. Renderizando automaticamente...");
                setTimeout(() => {
                    handleRenderVideo(result);
                }, 1000);
            }

            setExperienceData(result)
        } catch (error) {
            console.error("Erro ao buscar dados da experiência:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleShare = async () => {
        try {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            const shareOptions = [
                {
                    label: 'Baixar vídeo para compartilhar no Status',
                    description: 'Baixe o vídeo e compartilhe manualmente no Status do WhatsApp',
                    action: () => {
                        if (videoUrl) {
                            const a = document.createElement('a');
                            a.href = videoUrl;
                            a.download = `experiencia-dia-das-maes-${experience_id}.mp4`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            toast.success('Vídeo baixado! Agora você pode compartilhá-lo no Status do WhatsApp pelo seu celular.');

                            const instructionsModal = document.createElement('div');
                            instructionsModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50';
                            instructionsModal.innerHTML = `
                                <div class="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-white/10">
                                    <h3 class="text-white text-xl font-medium mb-4">Como compartilhar no Status do WhatsApp</h3>
                                    <ol class="space-y-3 text-white/90 text-sm mb-6">
                                        <li class="flex items-start">
                                            <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                                            <span>Abra o WhatsApp no seu <strong>celular</strong></span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                                            <span>Toque na aba <strong>Status</strong></span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                                            <span>Toque no botão <strong>Meu status</strong></span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                                            <span>Selecione o vídeo que você acabou de baixar da sua galeria</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">5</span>
                                            <span>Adicione uma legenda se desejar e publique!</span>
                                        </li>
                                    </ol>
                                    <p class="text-white/70 text-xs mb-4">Observação: O WhatsApp Web (versão para computador) não permite compartilhar diretamente para o Status. É necessário usar o aplicativo no celular.</p>
                                    <button
                                        class="w-full text-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
                                        id="close-instructions"
                                    >
                                        Entendi
                                    </button>
                                </div>
                            `;

                            document.body.appendChild(instructionsModal);

                            const closeButton = instructionsModal.querySelector('#close-instructions');
                            closeButton.addEventListener('click', () => {
                                document.body.removeChild(instructionsModal);
                            });

                            instructionsModal.addEventListener('click', (e) => {
                                if (e.target === instructionsModal) {
                                    document.body.removeChild(instructionsModal);
                                }
                            });
                        } else {
                            toast.error('O vídeo ainda não está disponível para download. Por favor, renderize o vídeo primeiro.');
                        }
                    }
                },
                {
                    label: 'Enviar link para meu celular',
                    description: 'Gera um QR code para abrir este link no seu celular',
                    action: () => {
                        const qrModal = document.createElement('div');
                        qrModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50';
                        qrModal.innerHTML = `
                            <div class="bg-gray-900 rounded-lg p-6 max-w-xs w-full border border-white/10 text-center">
                                <h3 class="text-white text-lg font-medium mb-3">Escaneie com seu celular</h3>
                                <p class="text-white/70 text-xs mb-4">Use a câmera do seu celular para escanear este QR code e abrir o link diretamente no dispositivo móvel.</p>
                                <div class="bg-white p-3 rounded-lg mx-auto mb-4" style="width: 200px; height: 200px;">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}"
                                         alt="QR Code" class="w-full h-full" />
                                </div>
                                <button
                                    class="w-full text-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                                    id="close-qr"
                                >
                                    Fechar
                                </button>
                            </div>
                        `;

                        document.body.appendChild(qrModal);

                        const closeButton = qrModal.querySelector('#close-qr');
                        closeButton.addEventListener('click', () => {
                            document.body.removeChild(qrModal);
                        });

                        qrModal.addEventListener('click', (e) => {
                            if (e.target === qrModal) {
                                document.body.removeChild(qrModal);
                            }
                        });
                    }
                },
                {
                    label: 'Compartilhar via WhatsApp',
                    description: 'Envia o link via chat do WhatsApp',
                    action: () => {
                        const whatsappUrl = `https://wa.me/?text=Veja esta linda experiência que criei para o Dia das Mães! ${encodeURIComponent(window.location.href)}`;
                        window.open(whatsappUrl, '_blank');
                    }
                },
                {
                    label: 'Copiar link',
                    description: 'Copia o link para a área de transferência',
                    action: () => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copiado para a área de transferência!');
                    }
                }
            ];

            if (isMobile) {
                shareOptions.unshift({
                    label: 'Compartilhar via WhatsApp Status (apenas celular)',
                    description: 'Abre diretamente o status do WhatsApp',
                    action: () => {
                        const whatsappStatusUrl = `whatsapp://status?text=Veja esta linda experiência que criei para o Dia das Mães! ${encodeURIComponent(window.location.href)}`;
                        window.open(whatsappStatusUrl, '_blank');
                    }
                });
            }

            const shareMenu = document.createElement('div');
            shareMenu.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
            shareMenu.innerHTML = `
                <div class="bg-gray-900 rounded-lg p-4 max-w-md w-full border border-white/10">
                    <h3 class="text-white text-lg font-medium mb-3">Compartilhar</h3>
                    <div class="space-y-2">
                        ${shareOptions.map((option, index) => `
                            <button
                                class="w-full text-left px-4 py-3 rounded-md hover:bg-white/10 text-white/90 transition-colors flex flex-col"
                                data-index="${index}"
                            >
                                <span class="font-medium text-sm">${option.label}</span>
                                ${option.description ? `<span class="text-white/60 text-xs mt-1">${option.description}</span>` : ''}
                            </button>
                        `).join('')}
                    </div>
                    <button
                        class="mt-3 w-full text-center px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white/90 text-sm transition-colors"
                        id="cancel-share"
                    >
                        Cancelar
                    </button>
                </div>
            `;

            document.body.appendChild(shareMenu);

            const buttons = shareMenu.querySelectorAll('button[data-index]');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    shareOptions[index].action();
                    document.body.removeChild(shareMenu);
                });
            });

            const cancelButton = shareMenu.querySelector('#cancel-share');
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(shareMenu);
            });

            shareMenu.addEventListener('click', (e) => {
                if (e.target === shareMenu) {
                    document.body.removeChild(shareMenu);
                }
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            toast.error('Ocorreu um erro ao compartilhar. Por favor, tente novamente.');
        }
    }

    const handleRenderVideo = async (data = null) => {
        setRenderingVideo(true);
        try {
            toast.loading("Estamos processando seu vídeo. Isso pode levar alguns instantes.");

            const dataToUse = data || experienceData;

            const renderResponse = await fetch('/api/render-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experienceId: experience_id,
                    videoInfo: {
                        ...dataToUse,
                        voice: {
                            ...dataToUse.voice,
                            gifNumber: dataToUse.voice?.gifNumber || 1
                        }
                    }
                }),
            });

            if (!renderResponse.ok) {
                throw new Error(`Erro ao iniciar renderização: ${renderResponse.statusText}`);
            }

            const renderData = await renderResponse.json();

            if (!renderData.success) {
                throw new Error(renderData.error || 'Erro desconhecido na renderização');
            }

            await convex.mutation(api.videoData.updateRenderedVideoUrl, {
                videoDataRecordId: experience_id,
                renderedVideoUrl: renderData.videoUrl,
                publicId: renderData.publicId
            });

            setVideoUrl(renderData.videoUrl);
            toast.success("Seu vídeo foi processado com sucesso e está pronto para download.");
        } catch (error) {
            console.error("Erro ao processar vídeo:", error);
            toast.error(`Não foi possível processar o vídeo: ${error.message}`);

            const fallbackUrl = 'https://res.cloudinary.com/de0abarv5/video/upload/v1689412424/samples/elephants.mp4';
            setVideoUrl(fallbackUrl);

            toast.info("Usando um vídeo de exemplo para demonstração");
        } finally {
            setRenderingVideo(false);
        }
    }



    if (loading) {
        return <LoadingState />;
    }

    // Simplificação para MVP: verificar apenas o status no banco de dados
    const isPaid = experienceData?.paymentStatus === "approved" || experienceData?.paymentStatus === "paid"

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>
            <Header />

            <div className='flex-1 flex items-center justify-center p-2'>
                <div className='max-w-6xl mx-auto w-full'>
                    {experienceData.voiceUrl ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
                            <VideoPreview
                                videoUrl={videoUrl}
                                experienceData={experienceData}
                                renderingVideo={renderingVideo}
                                isPaid={isPaid}
                            />

                            <ExperienceInfo
                                experienceData={experienceData}
                                experience_id={experience_id}
                                videoUrl={videoUrl}
                                renderingVideo={renderingVideo}
                                isPaid={isPaid}
                                handleShare={handleShare}
                                handleRenderVideo={handleRenderVideo}
                            />
                        </div>
                    ) : (
                        <ProcessingState />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewExperience
