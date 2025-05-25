'use client'

import React, { useEffect, useState, use } from 'react'
import { useConvex } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Button } from '../../../../../components/ui/button'
import { LoaderCircle, ArrowLeft, Share2, Download, Film } from 'lucide-react'
import Link from 'next/link'
import DownloadButton from '../../../../../components/experience/DownloadButton'
import { toast } from 'sonner'

function DownloadExperience({ params }) {
    const unwrappedParams = use(params)
    const experience_id = unwrappedParams.experience_id
    const [experienceData, setExperienceData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [renderingVideo, setRenderingVideo] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)

    const convex = useConvex()

    useEffect(() => {
        getExperienceData()
    }, [])

    const getExperienceData = async () => {
        try {
            const result = await convex.query(api.videoData.GetVideoDataById, {
                vid: experience_id
            })
            console.log("Dados da experiência:", result)

            if (result.paymentStatus === 'approved') {
                await convex.mutation(api.videoData.updatePaymentStatus, {
                    videoId: experience_id,
                    status: 'paid'
                })
                result.paymentStatus = 'paid'
            }

            setExperienceData(result)

            if (result.renderedVideoUrl) {
                console.log("Vídeo já renderizado:", result.renderedVideoUrl)
                setVideoUrl(result.renderedVideoUrl)
                toast.success("Seu vídeo já está disponível para download!")
            }
        } catch (error) {
            console.error("Erro ao buscar dados da experiência:", error)
            toast.error("Não foi possível carregar os dados da experiência")
        } finally {
            setLoading(false)
        }
    }

    const handleRenderVideo = async () => {
        setRenderingVideo(true)

        try {
            toast.loading("Estamos processando seu vídeo. Isso pode levar alguns instantes.")

            const renderResponse = await fetch('/api/render-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experienceId: experience_id,
                    videoInfo: experienceData
                }),
            })

            if (!renderResponse.ok) {
                throw new Error(`Erro ao iniciar renderização: ${renderResponse.statusText}`)
            }

            const renderData = await renderResponse.json()

            if (!renderData.success) {
                throw new Error(renderData.error || 'Erro desconhecido na renderização')
            }

            console.log('Resposta da renderização:', renderData)

            await convex.mutation(api.videoData.updateRenderedVideoUrl, {
                id: experience_id,
                renderedVideoUrl: renderData.videoUrl
            })

            setVideoUrl(renderData.videoUrl)
            toast.success("Seu vídeo foi processado com sucesso e está pronto para download.")
        } catch (error) {
            console.error("Erro ao processar vídeo:", error)
            toast.error(`Não foi possível processar o vídeo: ${error.message}`)

            const fallbackUrl = 'https://res.cloudinary.com/de0abarv5/video/upload/v1689412424/samples/elephants.mp4'
            setVideoUrl(fallbackUrl)

            toast.info("Usando um vídeo de exemplo para demonstração")
        } finally {
            setRenderingVideo(false)
        }
    }

    const handleShare = async () => {
        try {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

            const shareOptions = [
                {
                    label: 'Baixar vídeo para compartilhar no Status',
                    description: 'Baixe o vídeo e compartilhe manualmente no Status do WhatsApp',
                    action: () => {
                        if (videoUrl) {
                            const a = document.createElement('a')
                            a.href = videoUrl
                            a.download = `experiencia-dia-das-maes-${experience_id}.mp4`
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)

                            toast.success('Vídeo baixado! Agora você pode compartilhá-lo no Status do WhatsApp pelo seu celular.')

                            const instructionsModal = document.createElement('div')
                            instructionsModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'
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
                            `

                            document.body.appendChild(instructionsModal)

                            const closeButton = instructionsModal.querySelector('#close-instructions')
                            closeButton.addEventListener('click', () => {
                                document.body.removeChild(instructionsModal)
                            })

                            instructionsModal.addEventListener('click', (e) => {
                                if (e.target === instructionsModal) {
                                    document.body.removeChild(instructionsModal)
                                }
                            })
                        } else {
                            toast.error('O vídeo ainda não está disponível para download. Por favor, renderize o vídeo primeiro.')
                        }
                    }
                },
                {
                    label: 'Enviar link para meu celular',
                    description: 'Gera um QR code para abrir este link no seu celular',
                    action: () => {
                        const qrModal = document.createElement('div')
                        qrModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'
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
                        `

                        document.body.appendChild(qrModal)

                        const closeButton = qrModal.querySelector('#close-qr')
                        closeButton.addEventListener('click', () => {
                            document.body.removeChild(qrModal)
                        })

                        qrModal.addEventListener('click', (e) => {
                            if (e.target === qrModal) {
                                document.body.removeChild(qrModal)
                            }
                        })
                    }
                },
                {
                    label: 'Compartilhar via WhatsApp',
                    description: 'Envia o link via chat do WhatsApp',
                    action: () => {
                        const whatsappUrl = `https://wa.me/?text=Veja esta linda experiência que criei para o Dia das Mães! ${encodeURIComponent(window.location.href)}`
                        window.open(whatsappUrl, '_blank')
                    }
                },
                {
                    label: 'Copiar link',
                    description: 'Copia o link para a área de transferência',
                    action: () => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success('Link copiado para a área de transferência!')
                    }
                }
            ]

            if (isMobile) {
                shareOptions.unshift({
                    label: 'Compartilhar via WhatsApp Status (apenas celular)',
                    description: 'Abre diretamente o status do WhatsApp',
                    action: () => {
                        const whatsappStatusUrl = `whatsapp://status?text=Veja esta linda experiência que criei para o Dia das Mães! ${encodeURIComponent(window.location.href)}`
                        window.open(whatsappStatusUrl, '_blank')
                    }
                })
            }

            const shareMenu = document.createElement('div')
            shareMenu.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
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
            `

            document.body.appendChild(shareMenu)

            const buttons = shareMenu.querySelectorAll('button[data-index]')
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'))
                    shareOptions[index].action()
                    document.body.removeChild(shareMenu)
                })
            })

            const cancelButton = shareMenu.querySelector('#cancel-share')
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(shareMenu)
            })

            shareMenu.addEventListener('click', (e) => {
                if (e.target === shareMenu) {
                    document.body.removeChild(shareMenu)
                }
            })
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
            toast.error('Ocorreu um erro ao compartilhar. Por favor, tente novamente.')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <LoaderCircle className="animate-spin mr-2" />
                <span>Carregando experiência...</span>
            </div>
        )
    }

    const isPaid = experienceData?.paymentStatus === 'paid' || experienceData?.paymentStatus === 'approved'

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>
            <div className='p-4 sm:p-6 bg-black/50 backdrop-blur-md'>
                <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    <span className="text-base font-normal">Início</span>
                </Link>
            </div>

            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='max-w-md w-full'>
                    <h1 className='text-2xl font-bold mb-6 text-center'>Baixar Experiência</h1>

                    <div className='bg-black/30 border border-red-800/30 rounded-xl p-6 mb-6'>
                        <h2 className='text-lg font-medium mb-4'>Sua experiência está pronta!</h2>

                        <p className='text-white/70 mb-6'>
                            Você pode baixar o vídeo em alta qualidade para compartilhar com sua mãe
                            através de WhatsApp, e-mail ou qualquer outro meio.
                        </p>

                        {videoUrl ? (
                            <div className='space-y-4'>
                                <div className='rounded-lg overflow-hidden border border-white/20 mb-4'>
                                    <video
                                        src={videoUrl}
                                        controls
                                        className='w-full aspect-video'
                                    />
                                </div>

                                <DownloadButton
                                    videoUrl={videoUrl}
                                    fileName={`experiencia-dia-das-maes-${experience_id}.mp4`}
                                    className='w-full py-2'
                                />

                                <div className='text-center text-xs text-white/50 mt-2'>
                                    Tamanho aproximado: 15-20 MB
                                </div>

                                <div className='pt-4 border-t border-white/10 mt-4'>
                                    <Button
                                        onClick={handleShare}
                                        className='w-full bg-white/10 hover:bg-white/20 text-white'
                                    >
                                        <Share2 className='mr-2 h-4 w-4' />
                                        Compartilhar Link
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {experienceData && (
                                    <div className='rounded-lg overflow-hidden border border-white/20 mb-4 bg-black/30 p-4 text-center'>
                                        <Film className='h-12 w-12 mx-auto mb-2 text-red-500/70' />
                                        <p className='text-sm text-white/70'>
                                            Processe seu vídeo para visualizá-lo em alta qualidade
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleRenderVideo}
                                    disabled={renderingVideo}
                                    className='w-full bg-red-600 hover:bg-red-700 py-2'
                                >
                                    {renderingVideo ? (
                                        <>
                                            <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                                            Processando vídeo...
                                        </>
                                    ) : (
                                        <>
                                            <Download className='mr-2 h-4 w-4' />
                                            Processar Vídeo para Download
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className='bg-black/30 border border-white/10 rounded-xl p-4'>
                        <h3 className='text-sm font-medium mb-2'>Dicas para compartilhamento:</h3>
                        <ul className='text-xs text-white/70 space-y-2'>
                            <li>• Envie o vídeo diretamente pelo WhatsApp para sua mãe</li>
                            <li>• Compartilhe em grupos de família para que todos vejam</li>
                            <li>• Salve o vídeo para mostrar pessoalmente no Dia das Mães</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DownloadExperience
