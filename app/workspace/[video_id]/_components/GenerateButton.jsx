import { Button } from '../../../../components/ui/button'
import { LoaderCircle, Sparkles } from 'lucide-react';

export default function GenerateButton({ loading, onClick }) {
    return (
        <Button
            className='bg-primary text-white hover:bg-primary/90 transition-all duration-200 py-3 px-6 rounded-2xl font-medium text-sm shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={onClick}
            disabled={loading}
        >
            {loading ? (
                <>
                    <LoaderCircle className='animate-spin mr-2 h-4 w-4'/>
                    <span>Gerando...</span>
                </>
            ) : (
                <>
                    <Sparkles className='mr-2 h-4 w-4'/>
                    <span>Gerar Experiência</span>
                </>
            )}
        </Button>
    );
}