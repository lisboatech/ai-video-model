import { LoaderCircle } from 'lucide-react';

export default function LoadingState() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                <div className="absolute inset-4 rounded-full bg-black flex items-center justify-center">
                    <LoaderCircle className='animate-pulse h-8 w-8 text-primary/70' />
                </div>
            </div>
            <h2 className="text-xl font-light text-white mb-2">Carregando experiência</h2>
            <p className="text-white/60 text-sm">Por favor, aguarde alguns instantes...</p>
        </div>
    );
} 