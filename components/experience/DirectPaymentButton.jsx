'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import usePaymentFlow from '../../hooks/usePaymentFlow'

/**
 * Botão de pagamento direto para finalizar a experiência
 * Fluxo simplificado para MVP: após o pagamento, redireciona para a página de download
 *
 * @param {Object} props
 * @param {string} props.experienceId - ID da experiência
 * @param {string} props.userEmail - Email do usuário (opcional)
 * @param {string} props.className - Classes adicionais para o botão
 * @param {string} props.children - Conteúdo do botão
 */
export default function DirectPaymentButton({
  experienceId,
  userEmail,
  className = '',
  children = 'Finalizar Experiência'
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { initiatePayment } = usePaymentFlow()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Mostrar toast de processamento
      toast.loading("Preparando pagamento...", {
        id: "payment-toast",
        duration: 10000 // 10 segundos
      })

      // Iniciar o fluxo de pagamento simplificado
      // Após o pagamento, o usuário será redirecionado para a página de download
      await initiatePayment(experienceId, userEmail);

      // O toast será fechado automaticamente quando o usuário for redirecionado

    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
      toast.error("Erro ao processar pagamento. Tente novamente.", {
        id: "payment-toast"
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full bg-white text-black hover:bg-white/90 transition-all duration-300 py-3 rounded-xl font-normal text-base shadow-lg group ${className}`}
    >
      {isLoading ? (
        <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
      ) : null}
      <span className="mr-2">{isLoading ? 'Processando...' : children}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform duration-300">
        <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Button>
  )
}
