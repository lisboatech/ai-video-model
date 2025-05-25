'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Download, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import PaymentButton from './PaymentButton'

/**
 * Componente de botão de download para vídeos renderizados
 *
 * @param {Object} props
 * @param {string} props.videoUrl - URL do vídeo para download
 * @param {string} props.fileName - Nome do arquivo para download (default: 'experiencia-dia-das-maes.mp4')
 * @param {string} props.className - Classes adicionais para o botão
 * @param {string} props.experienceId - ID da experiência
 * @param {string} props.paymentStatus - Status do pagamento
 * @param {string} props.userEmail - Email do usuário
 */
const DownloadButton = ({
    videoUrl,
    fileName = 'experiencia-dia-das-maes.mp4',
    className = '',
    experienceId,
    paymentStatus,
    userEmail
}) => {
    const [downloading, setDownloading] = useState(false)

    // Verificar se o pagamento foi aprovado
    const isPaid = paymentStatus === 'approved' || paymentStatus === 'paid' || paymentStatus === 'success';

    const handleDownload = async () => {
        if (!videoUrl) {
            toast.error('URL do vídeo não disponível')
            return
        }

        setDownloading(true)

        try {
            // Para URLs externas, precisamos fazer fetch primeiro
            if (videoUrl.startsWith('http')) {
                toast.loading('Preparando o download...')

                // Fazer fetch do vídeo
                const response = await fetch(videoUrl)
                if (!response.ok) {
                    throw new Error(`Erro ao baixar o vídeo: ${response.statusText}`)
                }

                // Converter para blob
                const blob = await response.blob()

                // Criar URL do blob
                const blobUrl = URL.createObjectURL(blob)

                // Criar link para download
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = fileName
                document.body.appendChild(link)

                // Iniciar download
                link.click()

                // Limpar recursos
                document.body.removeChild(link)
                setTimeout(() => URL.revokeObjectURL(blobUrl), 100)

                toast.success('Seu vídeo está sendo baixado')
            } else {
                // Para URLs locais, podemos usar o método simples
                const link = document.createElement('a')
                link.href = videoUrl
                link.download = fileName
                document.body.appendChild(link)

                // Iniciar o download
                link.click()

                // Limpar o link
                document.body.removeChild(link)

                toast.success('Seu vídeo está sendo baixado')
            }
        } catch (error) {
            console.error('Erro ao fazer download:', error)
            toast.error(`Não foi possível baixar o vídeo: ${error.message}`)
        } finally {
            setDownloading(false)
        }
    }

    // Se o pagamento não foi aprovado, mostrar o botão de pagamento
    if (!isPaid && experienceId) {
        return (
            <PaymentButton
                experienceId={experienceId}
                userEmail={userEmail}
                isDownload={true}
                className={className}
            />
        )
    }

    // Se o pagamento foi aprovado, mostrar o botão de download
    return (
        <Button
            onClick={handleDownload}
            disabled={downloading || !videoUrl}
            className={`rounded-xl px-4 py-3 text-base font-light bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 ${className}`}
        >
            {downloading ? (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Baixando...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Vídeo
                </>
            )}
        </Button>
    )
}

export default DownloadButton
