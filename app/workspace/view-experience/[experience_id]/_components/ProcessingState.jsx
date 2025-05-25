import Link from 'next/link';
import { Button } from '../../../../../components/ui/button' 

export default function ProcessingState() {
    return (
        <div className='p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg text-center max-w-lg mx-auto'>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h2 className='text-xl font-light mb-4'>Experiência em processamento</h2>
            <p className='text-white/60 mb-4 text-sm'>
                Estamos preparando sua experiência. Por favor, aguarde alguns instantes ou volte mais tarde.
            </p>
            <Link href='/workspace'>
                <Button className='bg-white text-black hover:bg-white/90 transition-all duration-300 py-3 px-6 rounded-xl font-normal text-base shadow-lg group'>
                    <span className="mr-2">Voltar para o Início</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform duration-300">
                        <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Button>
            </Link>
        </div>
    );
}

