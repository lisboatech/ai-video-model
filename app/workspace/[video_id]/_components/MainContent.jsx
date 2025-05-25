import { useState } from 'react';
import Script from './Script';
import UploadFiles from './UploadFiles';
import BackgroundMusic from './BackgroundMusic';
import VoiceList from './VoiceList';
import GenerateButton from './GenerateButton';
import PreviewSection from './PreviewSection';

export default function MainContent({ videoData, onHandleInputChange, loading, onGenerateVideo }) {
    const [currentStep, setCurrentStep] = useState('message');

    const steps = [
        { id: 'message', label: 'Mensagem', icon: '💬' },
        { id: 'photos', label: 'Fotos', icon: '📸' },
        { id: 'voice', label: 'Voz', icon: '🎤' },
        { id: 'music', label: 'Música', icon: '🎵' }
    ];

    const canProceed = () => {
        switch (currentStep) {
            case 'message':
                return videoData?.script && videoData.script.length > 0;
            case 'photos':
                return videoData?.rawFiles && videoData.rawFiles.length > 0;
            case 'voice':
                return videoData?.voice?._id;
            case 'music':
                return videoData?.voice?.backgroundMusic;
            default:
                return false;
        }
    };

    const handleNext = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    const isLastStep = currentStep === 'music';
    const isFirstStep = currentStep === 'message';

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row gap-8 w-full items-start justify-center max-w-4xl">
                {/* Form - Apple Style */}
                <div className="w-full max-w-md mx-auto lg:max-w-lg">
                    {/* Card do formulário - Apple style */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Steps navigation - Apple Style */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-white/10 rounded-2xl p-1 w-full max-w-sm">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex-1 px-3 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center space-x-1 ${
                                        currentStep === step.id
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="text-sm">{step.icon}</span>
                                    <span className="hidden sm:inline text-xs">{step.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step content */}
                    <div className="min-h-[280px] sm:min-h-[320px]">
                        {currentStep === 'message' && (
                            <Script
                                videoData={videoData}
                                onHandleInputChange={onHandleInputChange}
                            />
                        )}

                        {currentStep === 'photos' && (
                            <UploadFiles
                                videoData={videoData}
                                onHandleInputChange={onHandleInputChange}
                            />
                        )}

                        {currentStep === 'voice' && (
                            <VoiceList
                                videoData={videoData}
                                onHandleInputChange={onHandleInputChange}
                            />
                        )}

                        {currentStep === 'music' && (
                            <BackgroundMusic
                                videoData={videoData}
                                onHandleInputChange={onHandleInputChange}
                            />
                        )}
                    </div>

                    {/* Navigation buttons - Apple Style */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/10">
                        <button
                            onClick={handlePrevious}
                            disabled={isFirstStep}
                            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
                                isFirstStep
                                    ? 'text-white/30 cursor-not-allowed'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            ← Anterior
                        </button>

                        {isLastStep ? (
                            <GenerateButton
                                loading={loading}
                                onClick={onGenerateVideo}
                            />
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all shadow-lg ${
                                    canProceed()
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-white/20 text-white/50 cursor-not-allowed'
                                }`}
                            >
                                Próximo →
                            </button>
                        )}
                    </div>
                    </div>
                </div>

                {/* Preview - Só na etapa de fotos (responsivo) */}
                {currentStep === 'photos' && (
                    <div className="w-full max-w-[280px] sm:max-w-[200px] lg:max-w-[250px] mt-6 lg:mt-0">
                        <PreviewSection
                            videoData={videoData}
                            previewKey={0}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}