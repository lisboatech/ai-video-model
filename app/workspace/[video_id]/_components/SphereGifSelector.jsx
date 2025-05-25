import React from 'react'
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export function SphereGifSelector({ videoData, onHandleInputChange }) {
    // Lista de GIFs disponíveis
    const gifOptions = [
        {
            id: 1,
            name: "Esfera Energética",
            description: "Partículas em movimento com energia vibrante",
            preview: "/gif/gif1.gif"
        },
        {
            id: 2,
            name: "Esfera Futurista",
            description: "Visualização 3D com efeito tecnológico avançado",
            preview: "/gif/gif2.gif"
        }
    ];

    // Função para selecionar um GIF
    const selectGif = (gifId) => {
        // Atualizar o objeto voice com o gifNumber selecionado
        const updatedVoice = {
            ...videoData.voice,
            gifNumber: gifId
        };
        
        onHandleInputChange('voice', updatedVoice);
    };

    return (
        <div className='p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg'>
            <h2 className='font-light text-xl flex gap-3 items-center text-white mb-5'>
                <Sparkles className='p-2 bg-primary/90 text-white h-10 w-10 rounded-lg shadow-lg' />
                Animação de IA
            </h2>

            <div>
                <label className='text-white/60 text-sm mb-4 block'>
                    Selecione uma animação para a primeira parte do vídeo
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                    {gifOptions.map((gif) => (
                        <div
                            key={gif.id}
                            className={`flex flex-col p-4 w-full cursor-pointer rounded-xl transition-all duration-300 backdrop-blur-sm
                            ${videoData?.voice?.gifNumber === gif.id
                                ? 'bg-primary/10 border border-primary/30 text-white shadow-lg'
                                : 'bg-black/30 border border-white/10 text-white/80 hover:bg-black/40 hover:border-white/20'}`}
                            onClick={() => selectGif(gif.id)}
                        >
                            <div className='relative w-full aspect-video mb-3 overflow-hidden rounded-lg'>
                                <Image
                                    src={gif.preview}
                                    alt={gif.name}
                                    width={300}
                                    height={200}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            
                            <div>
                                <h2 className='font-medium'>{gif.name}</h2>
                                <p className='text-xs opacity-70 mt-0.5'>{gif.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SphereGifSelector
