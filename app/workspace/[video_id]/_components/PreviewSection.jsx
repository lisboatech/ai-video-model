import { useState, useEffect } from 'react';

export default function PreviewSection({ videoData, previewKey }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate images every 3 seconds
    useEffect(() => {
        if (videoData?.assets?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev =>
                    prev >= videoData.assets.length - 1 ? 0 : prev + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [videoData?.assets?.length]);

    // Reset index when assets change
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [videoData?.assets]);

    const hasImages = videoData?.assets?.length > 0 || videoData?.rawFiles?.length > 0;
    const displayImages = videoData?.assets || [];
    const rawFiles = videoData?.rawFiles || [];

    return (
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="font-medium text-lg text-white">Prévia das Fotos</h3>
            </div>

            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg border border-white/5">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                <div className="aspect-[9/16] bg-gray-900 flex items-center justify-center relative">
                    {hasImages ? (
                        <>
                            {/* Display uploaded images */}
                            {displayImages.length > 0 && (
                                <img
                                    key={`uploaded-${currentImageIndex}`}
                                    src={displayImages[currentImageIndex]}
                                    alt={`Foto ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Display raw files if no uploaded images yet */}
                            {displayImages.length === 0 && rawFiles.length > 0 && (
                                <img
                                    key={`raw-${currentImageIndex}`}
                                    src={URL.createObjectURL(rawFiles[currentImageIndex])}
                                    alt={`Foto ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Image counter */}
                            {(displayImages.length > 1 || rawFiles.length > 1) && (
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    {currentImageIndex + 1} / {displayImages.length || rawFiles.length}
                                </div>
                            )}

                            {/* Navigation dots */}
                            {(displayImages.length > 1 || rawFiles.length > 1) && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {(displayImages.length > 0 ? displayImages : rawFiles).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentImageIndex
                                                    ? 'bg-primary'
                                                    : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Adicione suas fotos para ver a prévia
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Voice preview - separate from video preview */}
            {videoData?.voice?.preview && (
                <div className="mt-5 p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        Prévia da Narração:
                    </h4>
                    <audio
                        controls
                        className="w-full h-10"
                        src={videoData.voice.preview}
                    >
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                    <p className="text-xs text-white/50 mt-2">
                        Esta é uma prévia da voz. A narração final incluirá sua mensagem completa.
                    </p>
                </div>
            )}


        </div>
    );
}