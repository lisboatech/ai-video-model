import React, { useEffect, useRef, useState } from 'react'
import { Mars, Mic, PlayCircleIcon, Venus, Loader2, Zap } from 'lucide-react';
import { useVoices } from './VoiceContext';
import axios from 'axios';

export function VoiceList({ videoData, onHandleInputChange }) {
    const { voices, loading } = useVoices();
    const [playAudio, setPlayAudio] = useState();
    const [generatingPreview, setGeneratingPreview] = useState(null);
    const [previewCache, setPreviewCache] = useState({});
    const audioRef = useRef(null);

    // Vozes ElevenLabs
    const elevenLabsVoices = [
        {
            _id: 'elevenlabs_female',
            name: 'Feminina',
            accent: 'Português Brasileiro',
            description: 'Voz carinhosa e emotiva',
            gender: 'Female',
            provider: 'elevenlabs',
            voiceType: 'female',
            preview: null, // ElevenLabs não tem preview
            isPremium: false
        },
        {
            _id: 'elevenlabs_male',
            name: 'Masculina',
            accent: 'Português Brasileiro',
            description: 'Voz calorosa e expressiva',
            gender: 'Male',
            provider: 'elevenlabs',
            voiceType: 'male',
            preview: null,
            isPremium: false
        }
    ];

    // Combinar vozes Akool + ElevenLabs
    const allVoices = [...elevenLabsVoices, ...voices];

    // Função para gerar preview do ElevenLabs
    const generateElevenLabsPreview = async (voiceType) => {
        const cacheKey = `elevenlabs_${voiceType}`;

        // Verificar se já temos o preview em cache
        if (previewCache[cacheKey]) {
            console.log("🎧 Usando preview do cache:", cacheKey);
            setPlayAudio(previewCache[cacheKey]);
            return;
        }

        try {
            setGeneratingPreview(cacheKey);
            console.log("🎙️ Gerando preview ElevenLabs:", voiceType);

            const response = await axios.post('/api/elevenlabs-preview', {
                voiceType: voiceType
            });

            if (response.data.success) {
                const audioUrl = response.data.audioUrl;

                // Salvar no cache
                setPreviewCache(prev => ({
                    ...prev,
                    [cacheKey]: audioUrl
                }));

                // Reproduzir
                setPlayAudio(audioUrl);

                console.log("✅ Preview ElevenLabs gerado:", audioUrl);
            } else {
                console.error("❌ Erro ao gerar preview:", response.data.error);
                alert(`Erro ao gerar preview: ${response.data.error}`);
            }
        } catch (error) {
            console.error("❌ Erro na requisição de preview:", error);
            alert("Erro ao gerar preview. Tente novamente.");
        } finally {
            setGeneratingPreview(null);
        }
    };

    useEffect(() => {
        if (audioRef?.current && playAudio) {
            audioRef.current?.load();
            audioRef.current?.play();
        }
    }, [playAudio])

    return (
        <div>

            <audio
                ref={audioRef}
                className='hidden'
            >
                <source src={playAudio} type='audio/mp3' />
            </audio>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-white/60">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Carregando vozes...</span>
                    </div>
                </div>
            ) : allVoices.length === 0 ? (
                <div className='text-center py-8 space-y-3'>
                    <div className='text-white/50'>
                        <Mic className='h-8 w-8 mx-auto mb-2 opacity-50' />
                        <p className='text-sm'>Apenas vozes premium disponíveis</p>
                        <p className='text-xs opacity-70'>Configure AKOOL_API_TOKEN para mais opções</p>
                    </div>

                    {/* Mostrar apenas vozes ElevenLabs quando não há vozes Akool */}
                    <div className='space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar'>
                        {elevenLabsVoices.map((voice, index) => (
                            <div
                                key={index}
                                className={`flex justify-between items-center p-3 w-full cursor-pointer rounded-lg transition-all duration-200 group relative
                                ${videoData?.voice?._id === voice?._id
                                    ? 'bg-primary/10 border border-primary/30 text-white shadow-lg'
                                    : 'bg-black/30 border border-white/10 text-white/80 hover:bg-black/40 hover:border-white/20'}`}
                                onClick={() => onHandleInputChange('voice', voice)}
                            >


                                <div className='flex gap-2 items-center flex-1 min-w-0'>
                                    <button
                                        className={`rounded-full p-1.5 flex items-center justify-center flex-shrink-0 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 ${
                                            generatingPreview === `elevenlabs_${voice.voiceType}` ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            generateElevenLabsPreview(voice.voiceType);
                                        }}
                                        disabled={generatingPreview === `elevenlabs_${voice.voiceType}`}
                                        title={generatingPreview === `elevenlabs_${voice.voiceType}` ? 'Gerando preview...' : 'Reproduzir prévia'}
                                    >
                                        {generatingPreview === `elevenlabs_${voice.voiceType}` ? (
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        ) : (
                                            <PlayCircleIcon className='h-4 w-4' />
                                        )}
                                    </button>
                                    <div className='min-w-0 flex-1'>
                                        <div className="flex items-center gap-2">
                                            <h3 className='font-medium text-sm truncate'>{voice.name}</h3>
                                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                                                ElevenLabs
                                            </span>
                                        </div>
                                        <p className='text-xs opacity-70 truncate'>
                                            {voice.accent}
                                            {voice.description && ` (${voice.description})`}
                                        </p>
                                    </div>
                                </div>

                                <div className={`rounded-full p-1 flex-shrink-0 ${voice?.gender === 'Male' ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                                    {voice?.gender === 'Male'
                                        ? <Mars className='text-blue-400 h-3 w-3' />
                                        : <Venus className='text-pink-400 h-3 w-3' />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar'>
                    {allVoices.map((voice, index) => (
                    <div
                        key={index}
                        className={`flex justify-between items-center p-3 w-full cursor-pointer rounded-lg transition-all duration-200 group relative
                        ${videoData?.voice?._id === voice?._id
                            ? 'bg-primary/10 border border-primary/30 text-white shadow-lg'
                            : voice.isPremium
                                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 text-white hover:from-yellow-500/15 hover:to-orange-500/15'
                                : 'bg-black/30 border border-white/10 text-white/80 hover:bg-black/40 hover:border-white/20'}`}
                        onClick={() => onHandleInputChange('voice', voice)}
                    >


                        <div className='flex gap-2 items-center flex-1 min-w-0'>
                            <button
                                className={`rounded-full p-1.5 flex items-center justify-center flex-shrink-0 ${
                                    videoData?.voice?._id === voice?._id
                                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                    : voice.isPremium
                                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                        : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60'
                                } ${
                                    voice.isPremium
                                        ? (generatingPreview === `elevenlabs_${voice.voiceType}` ? 'opacity-50 cursor-not-allowed' : '')
                                        : (!voice.preview ? 'opacity-50 cursor-not-allowed' : '')
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (voice.isPremium) {
                                        generateElevenLabsPreview(voice.voiceType);
                                    } else if (voice.preview) {
                                        setPlayAudio(voice.preview);
                                    }
                                }}
                                disabled={
                                    voice.isPremium
                                        ? generatingPreview === `elevenlabs_${voice.voiceType}`
                                        : !voice.preview
                                }
                                title={
                                    voice.isPremium
                                        ? (generatingPreview === `elevenlabs_${voice.voiceType}` ? 'Gerando preview...' : 'Reproduzir prévia premium')
                                        : (voice.preview ? 'Reproduzir prévia' : 'Prévia não disponível')
                                }
                            >
                                {voice.isPremium && generatingPreview === `elevenlabs_${voice.voiceType}` ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                    <PlayCircleIcon className='h-4 w-4' />
                                )}
                            </button>
                            <div className='min-w-0 flex-1'>
                                <div className="flex items-center gap-2">
                                    <h3 className='font-medium text-sm truncate'>{voice.name}</h3>
                                    {voice.isPremium && (
                                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                                            ElevenLabs
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs opacity-70 truncate'>
                                    {voice.accent}
                                    {voice.description && ` (${voice.description})`}
                                </p>
                            </div>
                        </div>

                        <div className={`rounded-full p-1 flex-shrink-0 ${voice?.gender === 'Male' ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                            {voice?.gender === 'Male'
                                ? <Mars className='text-blue-400 h-3 w-3' />
                                : <Venus className='text-pink-400 h-3 w-3' />
                            }
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VoiceList
