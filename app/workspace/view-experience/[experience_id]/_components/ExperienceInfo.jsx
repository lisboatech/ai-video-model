import { Button } from  '../../../../../components/ui/button'
import { Share2, Download, LoaderCircle } from 'lucide-react';
import DownloadButton from '../../../../../components/experience/DownloadButton' ;
import DirectPaymentButton from '../../../../../components/experience/DirectPaymentButton' ;
import PaymentStatus from '../../../../../components/experience/PaymentStatus';


export default function ExperienceInfo({
    experienceData,
    experience_id,
    videoUrl,
    renderingVideo,
    isPaid,
    handleShare,
    handleRenderVideo
}) {
    return (
        <div className='flex flex-col gap-3 max-w-lg'>
            <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg">
                <h2 className='text-xl font-light mb-2'>Cartão de Amor Especial</h2>
                <p className='text-white/70 text-sm mb-4'>
                    Compartilhe esta experiência única com a pessoa amada e demonstre todo o seu amor e gratidão.
                </p>

                <div className="mb-4">
                    <PaymentStatus
                        status={isPaid ? 'approved' : 'pending'}
                    />
                </div>

                {isPaid ? (
                    <div className='space-y-4'>
                        {videoUrl ? (
                            <div className='space-y-4'>
                                <DownloadButton
                                    videoUrl={videoUrl}
                                    fileName={`experiencia-especial-${experience_id}.mp4`}
                                    className='w-full py-3'
                                />

                                <Button
                                    className='w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-normal text-base transition-all duration-300 group'
                                    onClick={handleShare}
                                >
                                    <Share2 className='mr-2 text-primary' />
                                    <span className="mr-2">Compartilhar Link</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform duration-300">
                                        <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className='w-full bg-white text-black hover:bg-white/90 transition-all duration-300 py-3 rounded-xl font-normal text-base shadow-lg group'
                                onClick={() => handleRenderVideo()}
                                disabled={renderingVideo}
                            >
                                {renderingVideo ? (
                                    <LoaderCircle className='animate-spin mr-2'/>
                                ) : (
                                    <Download className='mr-2 text-primary'/>
                                )}
                                <span className="mr-2">{renderingVideo ? 'Processando...' : 'Renderizar Vídeo'}</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform duration-300">
                                    <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Button>
                        )}
                    </div>
                ) : (
                    <DirectPaymentButton
                        experienceId={experience_id}
                        userEmail={experienceData.userEmail}
                    >
                        Finalizar Experiência
                    </DirectPaymentButton>
                )}
            </div>
        </div>
    );
}