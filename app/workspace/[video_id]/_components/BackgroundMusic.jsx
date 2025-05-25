import React, { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group'
import { Label } from '../../../../components/ui/label'
import { Button } from '../../../../components/ui/button'


export function BackgroundMusic({ videoData, onHandleInputChange }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMusic, setCurrentMusic] = useState(null);
    const audioRef = useRef(null);

    const backgroundOptions = [
        { id: "emocional", name: "Emocional", description: "Melodia profunda e emotiva", preview: "/audio/background/emocional.mp3" },
        { id: "gratidao", name: "Gratidão", description: "Música que expressa gratidão e amor", preview: "/audio/background/gratidao.mp3" },
        { id: "memorias", name: "Memórias", description: "Sons que evocam memórias especiais", preview: "/audio/background/memorias.mp3" }
    ];

    // Inicializar com o valor padrão se não existir
    useEffect(() => {
        if (!videoData?.voice?.backgroundMusic) {
            handleBackgroundChange('emocional');
        }
    }, [videoData]);

    const handleBackgroundChange = (value) => {
        // Atualizar o estado do componente pai
        onHandleInputChange('voice', {
            ...(videoData?.voice || {}),
            backgroundMusic: value
        });

        // Parar a reprodução atual se estiver tocando
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const handlePlayPause = (musicId) => {
        if (isPlaying && currentMusic === musicId) {
            // Pausar a música atual
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            // Reproduzir a música selecionada
            const music = backgroundOptions.find(option => option.id === musicId);
            if (music) {
                if (audioRef.current) {
                    audioRef.current.src = music.preview;
                    audioRef.current.load();
                    audioRef.current.play();
                    setIsPlaying(true);
                    setCurrentMusic(musicId);
                }
            }
        }
    };

    return (
        <div>

            <audio
                ref={audioRef}
                className='hidden'
                onEnded={() => setIsPlaying(false)}
            />

            <div className="space-y-3">
                <RadioGroup
                    value={videoData?.voice?.backgroundMusic || 'emocional'}
                    onValueChange={handleBackgroundChange}
                    className="space-y-3"
                >
                    {backgroundOptions.map(option => (
                        <div
                            key={option.id}
                            className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                videoData?.voice?.backgroundMusic === option.id
                                ? 'bg-primary/10 border border-primary/30'
                                : 'bg-black/30 border border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <RadioGroupItem
                                    value={option.id}
                                    id={`bg-${option.id}`}
                                    className={`flex-shrink-0 ${videoData?.voice?.backgroundMusic === option.id ? 'text-primary border-primary' : 'border-white/30'}`}
                                />
                                <Label htmlFor={`bg-${option.id}`} className="flex flex-col cursor-pointer min-w-0 flex-1">
                                    <span className={`font-medium text-sm truncate ${videoData?.voice?.backgroundMusic === option.id ? 'text-white' : 'text-white/80'}`}>
                                        {option.name}
                                    </span>
                                    <span className={`text-xs truncate ${videoData?.voice?.backgroundMusic === option.id ? 'text-white/70' : 'text-white/50'}`}>
                                        {option.description}
                                    </span>
                                </Label>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`ml-2 rounded-full p-1.5 flex-shrink-0 ${
                                    isPlaying && currentMusic === option.id
                                    ? 'bg-primary text-white hover:bg-primary/80'
                                    : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60'
                                }`}
                                onClick={() => handlePlayPause(option.id)}
                            >
                                {isPlaying && currentMusic === option.id ? (
                                    <Pause className="h-3 w-3" />
                                ) : (
                                    <Play className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    )
}

export default BackgroundMusic
