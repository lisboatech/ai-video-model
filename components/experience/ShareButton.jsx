'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Share2, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import PaymentButton from './PaymentButton'

/**
 * Componente de botão de compartilhamento para vídeos
 *
 * @param {Object} props
 * @param {string} props.videoUrl - URL do vídeo para compartilhar
 * @param {string} props.className - Classes adicionais para o botão
 * @param {string} props.experienceId - ID da experiência
 * @param {string} props.paymentStatus - Status do pagamento
 * @param {string} props.userEmail - Email do usuário
 */
const ShareButton = ({
    videoUrl,
    className = '',
    experienceId,
    paymentStatus,
    userEmail
}) => {
    const [sharing, setSharing] = useState(false)

    // Verificar se o pagamento foi aprovado
    const isPaid = paymentStatus === 'approved' || paymentStatus === 'paid';

    const handleShare = async () => {
        if (!videoUrl) {
            toast.error('URL do vídeo não disponível')
            return
        }

        setSharing(true)

        try {
            // Compartilhar no WhatsApp
            const whatsappUrl = `https://wa.me/?text=Olá! Criei uma experiência especial para o Dia das Mães. Confira: ${encodeURIComponent(videoUrl)}`
            
            // Abrir em uma nova janela
            window.open(whatsappUrl, '_blank')
            
            toast.success('Compartilhando no WhatsApp')
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
            toast.error(`Não foi possível compartilhar o vídeo: ${error.message}`)
        } finally {
            setSharing(false)
        }
    }

    // Se o pagamento não foi aprovado, mostrar o botão de pagamento
    if (!isPaid && experienceId) {
        return (
            <PaymentButton 
                experienceId={experienceId}
                userEmail={userEmail}
                isDownload={false}
                className={className}
            />
        )
    }

    // Se o pagamento foi aprovado, mostrar o botão de compartilhamento
    return (
        <Button
            onClick={handleShare}
            disabled={sharing || !videoUrl}
            className={`rounded-full px-6 py-6 text-base font-light bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 ${className}`}
        >
            {sharing ? (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Compartilhando...
                </>
            ) : (
                <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                </>
            )}
        </Button>
    )
}

export default ShareButton
