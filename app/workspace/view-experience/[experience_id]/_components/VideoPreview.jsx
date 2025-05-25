import { Player } from '@remotion/player';
import PreviewAd1 from '../../_components/PreviewAd1';
import { LoaderCircle } from 'lucide-react';

export default function VideoPreview({ videoUrl, experienceData, renderingVideo, isPaid }) {
    return (
        <div className='flex justify-center'>
            <div className='relative rounded-2xl overflow-hidden shadow-2xl' style={{ width: '320px', maxWidth: '100%' }}>
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent z-0"></div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"></div>

                <div className="relative z-1 rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                    {videoUrl && isPaid ? (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className='w-full h-full object-cover'
                            style={{ objectFit: 'contain', backgroundColor: 'black' }}
                        />
                    ) : (
                        <div className='h-full w-full'>
                            <Player
                                component={PreviewAd1}
                                durationInFrames={1800}
                                compositionWidth={1080}
                                compositionHeight={1920}
                                fps={30}
                                controls
                                showVolumeControls
                                clickToPlay
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                inputProps={{
                                    videoInfo: {
                                        ...experienceData,
                                        voice: {
                                            ...experienceData.voice,
                                            gifNumber: experienceData.voice?.gifNumber || 1
                                        }
                                    }
                                }}
                                acknowledgeRemotionLicense
                            />
                        </div>
                    )}

                    {renderingVideo && (
                        <div className='absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center'>
                            <div className='text-center p-6 max-w-xs'>
                                <div className="relative w-16 h-16 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                                    <div className="absolute inset-3 rounded-full bg-black/80 flex items-center justify-center">
                                        <LoaderCircle className='animate-pulse h-6 w-6 text-primary' />
                                    </div>
                                </div>
                                <p className='text-white/90 font-light'>
                                    Renderizando seu vídeo
                                </p>
                                <p className='text-white/60 text-sm mt-2'>
                                    Por favor, aguarde alguns instantes...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 