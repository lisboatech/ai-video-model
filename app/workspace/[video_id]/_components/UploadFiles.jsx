import React, { useEffect, useState } from 'react'
import { FilePlus2, ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

export function UploadFiles({ videoData, onHandleInputChange }) {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
        console.log(selectedFiles);
    }

    const removeImage = (indexToRemove) => {
        const uploadedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(uploadedFiles);
    }

    useEffect(() => {
        if (files && files.length > 0) {
            // Atualizar rawFiles para o processamento interno
            onHandleInputChange('rawFiles', files);

            // Fazer upload das imagens para o ImageKit
            const uploadImages = async () => {
                try {
                    const uploadedUrls = [];

                    for (const file of files) {
                        // Criar um FormData para o upload
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('fileName', `mothers_day_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`);
                        formData.append('folder', 'mothers-day-experiences');

                        // Fazer o upload para o ImageKit através da API
                        const response = await fetch('/api/upload-image', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('Falha ao fazer upload da imagem');
                        }

                        const data = await response.json();
                        uploadedUrls.push(data.url);
                    }

                    console.log('Imagens enviadas para ImageKit:', uploadedUrls);

                    // Atualizar assets com as URLs do ImageKit
                    // Isso vai acionar o salvamento no banco de dados através da função onHandleInputChange
                    onHandleInputChange('assets', uploadedUrls);
                } catch (error) {
                    console.error('Erro ao fazer upload das imagens:', error);

                    // Em caso de erro, usar URLs locais temporárias para a prévia
                    const localUrls = files.map(file => URL.createObjectURL(file));
                    onHandleInputChange('assets', localUrls);
                }
            };

            uploadImages();
        }
    }, [files])

    return (
        <div className='space-y-6'>
            {/* Botão Adicionar - Apple Style Centralizado */}
            {files.length === 0 && (
                <div className="flex items-center justify-center min-h-[280px] sm:min-h-[320px]">
                    <label className='h-[200px] w-full max-w-[340px] sm:h-[220px] border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-200 group backdrop-blur-sm shadow-lg'>
                        <div className="bg-primary/10 p-5 rounded-3xl mb-5 group-hover:bg-primary/20 transition-all duration-200 group-hover:scale-105">
                            <ImageIcon className='h-10 w-10 sm:h-12 sm:w-12 text-primary group-hover:scale-110 transition-transform' />
                        </div>
                        <span className='text-white text-lg sm:text-xl font-medium mb-2'>Adicionar Fotos</span>
                        <span className='text-white/60 text-sm sm:text-base text-center px-4'>Clique para selecionar suas memórias especiais</span>
                        <input
                            type='file'
                            className='hidden'
                            accept='image/*'
                            multiple
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            )}

            {/* Grid de fotos - Apple Style */}
            {files.length > 0 && (
                <div>
                    {/* Título da seção com melhor design */}
                    <div className="mb-6 text-center">
                        <h3 className="text-white text-base sm:text-lg font-medium mb-2">Suas Memórias</h3>
                        <div className="inline-flex items-center bg-primary/10 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className='text-primary text-sm font-medium'>
                                {files.length} foto{files.length > 1 ? 's' : ''} selecionada{files.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Grid responsivo otimizado para mobile */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-2 sm:px-0'>
                        {/* Botão adicionar mais fotos - responsivo */}
                        <label className='aspect-square border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer rounded-2xl sm:rounded-3xl bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-200 group min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] shadow-lg active:scale-95'>
                            <div className="bg-primary/10 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl mb-1 sm:mb-2 lg:mb-3 group-hover:bg-primary/20 transition-all duration-200 group-hover:scale-105">
                                <FilePlus2 className='h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary group-hover:scale-110 transition-transform' />
                            </div>
                            <span className='text-white/70 text-xs sm:text-sm font-medium group-hover:text-white transition-colors'>Adicionar</span>
                            <input
                                type='file'
                                className='hidden'
                                accept='image/*'
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>

                        {/* Fotos adicionadas - design premium */}
                        {files.map((file, index) => (
                            <div key={index} className='aspect-square relative group overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-primary/30 hover:shadow-primary/20 transition-all duration-300 backdrop-blur-sm'>
                                {/* Container da imagem com padding interno */}
                                <div className="absolute inset-2 rounded-2xl overflow-hidden bg-black/20">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`Foto ${index + 1}`}
                                        width={200}
                                        height={200}
                                        className='h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110'
                                    />
                                </div>

                                {/* Overlay com gradiente premium */}
                                <div className='absolute inset-2 rounded-2xl bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'></div>

                                {/* Badge número da foto - sempre visível no mobile */}
                                <div className='absolute bottom-3 left-3 bg-primary/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow-lg sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 border border-white/20'>
                                    #{index + 1}
                                </div>

                                {/* Botão remover - sempre visível no mobile */}
                                <button
                                    className='absolute top-3 right-3 bg-red-500/95 backdrop-blur-md text-white rounded-full p-2 sm:p-2.5 shadow-xl hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-200 border border-white/20 sm:opacity-0 sm:group-hover:opacity-100'
                                    onClick={() => removeImage(index)}
                                >
                                    <X className='h-3 w-3 sm:h-4 sm:w-4' />
                                </button>

                                {/* Indicador de seleção */}
                                <div className='absolute top-3 left-3 w-3 h-3 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 animate-pulse'></div>

                                {/* Efeito de brilho no hover */}
                                <div className='absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadFiles
