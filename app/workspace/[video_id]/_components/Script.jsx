import React, { useState, useEffect } from 'react'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { MessageSquare } from 'lucide-react'

export function Script({ videoData, onHandleInputChange }) {
    // Extrair as mensagens geradas do scriptVariant quando os dados são carregados
    useEffect(() => {
        if (videoData?.scriptVariant?.scripts && videoData?.scriptVariant?.scripts.length > 0 && !videoData?.script) {
            // Se não temos script selecionado, selecionar o primeiro por padrão
            // Isso vai acionar o salvamento no banco de dados através da função onHandleInputChange
            onHandleInputChange('script', videoData.scriptVariant.scripts[0].content);
        }
    }, [videoData]);

    return (
        <div className='space-y-6'>
            {/* Editor de mensagem - Apple Style */}
            <div>
                <label className='text-white text-sm sm:text-base font-medium mb-3 block'>Sua Mensagem Personalizada</label>
                <Textarea
                    className='bg-white/10 border border-white/20 text-white rounded-xl p-4 h-[200px] sm:h-[220px] resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 text-sm sm:text-base placeholder:text-white/60 overflow-y-auto'
                    value={videoData?.script || ''}
                    onChange={(e) => onHandleInputChange('script', e.target.value)}
                    placeholder="Escreva sua mensagem aqui ou selecione uma das sugestões abaixo..."
                />
            </div>

            {/* Sugestões de mensagens - Apple Style */}
            {videoData?.scriptVariant?.scripts && videoData?.scriptVariant?.scripts.length > 0 && (
                <div>
                    <h4 className='text-white text-sm sm:text-base font-medium mb-4 flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Sugestões Personalizadas
                    </h4>
                    <div className='grid grid-cols-1 gap-3'>
                        {videoData.scriptVariant.scripts.map((script, index) => (
                            <div
                                key={index}
                                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 group min-h-[60px] sm:min-h-[70px]
                                    ${script?.content === videoData?.script
                                        ? 'border border-primary/50 bg-primary/10 text-white shadow-lg'
                                        : 'border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/30 hover:shadow-lg'}
                                `}
                                onClick={() => {
                                    onHandleInputChange('script', script?.content);
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-medium text-sm sm:text-base">{script.title || `Opção ${index + 1}`}</h5>
                                    {script?.content === videoData?.script && (
                                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-0.5"></div>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed">
                                    {script.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Script
