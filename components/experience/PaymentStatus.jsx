'use client'

import React from 'react'
import { CheckCircle, AlertCircle, Clock, LoaderCircle } from 'lucide-react'

/**
 * Componente para exibir o status do pagamento
 *
 * @param {Object} props
 * @param {string} props.status - Status do pagamento (approved, pending, failed, processing)
 * @param {string} props.className - Classes adicionais para o componente
 */
const PaymentStatus = ({ status, className = '' }) => {
  // Definir configurações com base no status
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: 'Pagamento aprovado',
      description: 'Seu pagamento foi confirmado com sucesso.',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-500'
    },
    pending: {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      text: 'Pagamento pendente',
      description: 'Aguardando confirmação do pagamento.',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-500'
    },
    failed: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: 'Pagamento recusado',
      description: 'Houve um problema com seu pagamento. Por favor, tente novamente.',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-500'
    },
    processing: {
      icon: <LoaderCircle className="h-5 w-5 text-blue-500 animate-spin" />,
      text: 'Processando pagamento',
      description: 'Seu pagamento está sendo processado.',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-500'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: 'Erro no processamento',
      description: 'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-500'
    },
    paid: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: 'Pagamento aprovado',
      description: 'Seu pagamento foi confirmado com sucesso.',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-500'
    }
  }

  // Usar configuração padrão se o status não for reconhecido
  const config = statusConfig[status] || statusConfig.pending

  return (
    <div className={`rounded-xl p-4 ${config.bgColor} border ${config.borderColor} ${className}`}>
      <div className="flex items-center">
        <div className="mr-3">
          {config.icon}
        </div>
        <div>
          <h3 className={`text-sm font-medium ${config.textColor}`}>{config.text}</h3>
          <p className="text-xs text-white/70 mt-1">{config.description}</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus
