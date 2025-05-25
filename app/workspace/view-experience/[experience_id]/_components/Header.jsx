import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
    return (
        <div className='p-4 sm:p-6 bg-black/30 backdrop-blur-md border-b border-white/5'>
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span className="text-base font-normal">Início</span>
            </Link>
        </div>
    );
}