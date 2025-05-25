"use client"
import React, { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { LoaderCircle, Heart } from 'lucide-react'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'


export function MothersDay() {
    const [formData, setFormData] = useState({
        relationship: '',
        personName: '',
        occasion: '',
        tone: '',
        senderName: ''
    });
    const [loading, setLoading] = useState(false);
    const CreateNewVideoData = useMutation(api.videoData.CreateNewVideoData);
    const router = useRouter();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Relacionamentos que precisam do nome da pessoa
    const needsPersonName = ['tia', 'tio', 'amiga', 'amigo', 'prima', 'primo'];
    const showPersonNameField = needsPersonName.includes(formData.relationship);

    const canProceed = () => {
        const basicFields = formData.relationship && formData.occasion && formData.senderName;
        const personNameRequired = showPersonNameField ? formData.personName : true;
        return basicFields && personNameRequired;
    };



    const createPersonalizedPrompt = (data) => {
        let prompt = '';

        if (data.customTopic) {
            prompt = data.customTopic;
        } else {
            // Construir prompt baseado nos campos preenchidos
            const parts = [];

            if (data.relationship) {
                parts.push(`Para minha ${data.relationship}`);
            }

            if (data.personName) {
                parts.push(`chamada ${data.personName}`);
            }

            if (data.occasion) {
                parts.push(`na ocasião de ${data.occasion}`);
            }

            if (data.memory) {
                parts.push(`lembrando de ${data.memory}`);
            }

            if (data.characteristics) {
                parts.push(`destacando que ela é ${data.characteristics}`);
            }

            if (data.tone) {
                parts.push(`com tom ${data.tone}`);
            }

            prompt = parts.join(', ');
        }

        return prompt || 'amor e gratidão';
    };

    const generatePersonalizedMessage = async () => {
        // Validação básica
        if (!formData.relationship || !formData.occasion || !formData.senderName) {
            toast.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (showPersonNameField && !formData.personName) {
            toast.error('Por favor, informe o nome da pessoa');
            return;
        }

        setLoading(true);
        try {
            // Criar um prompt personalizado baseado nos dados do formulário
            const personalizedTopic = createPersonalizedPrompt(formData);

            // Usar a API de geração de script com o prompt personalizado
            const result = await axios.post('/api/generate-script', {
                topic: personalizedTopic,
                formData: formData // Enviar dados do formulário para contexto adicional
            });

            console.log(result.data);

            // Processar o resultado com tratamento de erro melhorado
            let JSONResult;
            try {
                // Primeiro, verificar se o resultado já é um objeto JSON
                if (typeof result?.data === 'object') {
                    JSONResult = result.data;
                } else {
                    // Se for uma string, limpar marcações de código e tentar fazer parse
                    const RAWResult = (result?.data || '').replace(/```json|```/g, '').trim();
                    JSONResult = JSON.parse(RAWResult);
                }

                // Verificar se o resultado tem o formato esperado
                if (!JSONResult.scripts && Array.isArray(JSONResult)) {
                    // Converter formato de array para o formato esperado com scripts
                    JSONResult = {
                        scripts: JSONResult.map((item, index) => ({
                            title: item.title || `Mensagem ${index + 1}`,
                            content: item.content || item.message || item
                        }))
                    };
                }

                console.log("JSON processado:", JSONResult);
            } catch (error) {
                console.error("Erro ao processar JSON:", error);
                // Criar um formato padrão em caso de erro
                JSONResult = {
                    scripts: [{
                        title: "Mensagem para o Dia das Mães",
                        content: typeof result?.data === 'string' ? result.data : "Não foi possível gerar uma mensagem. Por favor, tente novamente."
                    }]
                };
            }

            // Obter o ID da sessão do localStorage
            const sessionId = localStorage.getItem('sessionId');

            // Criar entrada no banco de dados com dados personalizados
            const resp = await CreateNewVideoData({
                topic: personalizedTopic,
                scriptVariant: JSONResult,
                sessionId: sessionId,
                // Adicionar dados de personalização
                personalizationData: formData,
                voice: {
                    backgroundMusic: 'emocional' // Valor padrão para música de fundo
                }
            });

            console.log(resp);

            // Redirecionar para a página de edição
            router.push('/workspace/mothers-day/' + resp);
        } catch (error) {
            console.error("Erro ao gerar mensagem:", error);
            toast.error("Ocorreu um erro ao gerar a mensagem. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
            {/* Background effects - Dark theme */}
            <div className="absolute inset-0 bg-black z-0"></div>

            {/* Efeito de grade futurista */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 z-0"></div>

            {/* Subtle gradients with primary color */}
            <div className="absolute top-0 right-0 w-full h-full opacity-20 z-0">
                <div className="absolute top-0 right-0 w-[60%] h-[50%] bg-primary/10 rounded-full blur-[180px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-primary/5 rounded-full blur-[180px] animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow animation-delay-1000"></div>
            </div>

            {/* Light effects */}
            <div className="absolute top-[20%] right-[15%] h-0 w-[20rem] shadow-[0_0_500px_15px_rgba(220,38,38,0.1)] -rotate-[30deg] z-0"></div>
            <div className="absolute bottom-[30%] left-[10%] h-0 w-[15rem] shadow-[0_0_400px_10px_rgba(220,38,38,0.05)] rotate-[20deg] z-0"></div>

            {/* Header with back button - Apple style */}
            <div className="w-full p-4 sm:p-6 z-10 absolute top-0 left-0">
                <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    <span className="text-base font-normal">Voltar</span>
                </Link>
            </div>

            {/* Main content container */}
            <div className="flex-1 flex items-center justify-center min-h-screen py-6 sm:py-8">
                <div className="container mx-auto px-4 sm:px-6 z-10 max-w-2xl">
                    <div className="flex items-center justify-center">
                        {/* Form - Apple Style */}
                        <div className="w-full max-w-md">
                            {/* Card do formulário - Apple style */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                                {/* Formulário Apple Style */}
                                <div className="space-y-6">
                                    {/* Layout responsivo - mobile: coluna única, desktop: grid 2x2 */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Para quem é a mensagem */}
                                        <div>
                                            <label className="block text-white text-sm sm:text-base font-medium mb-2">
                                                Para quem é a mensagem?
                                            </label>
                                            <select
                                                value={formData.relationship}
                                                onChange={(e) => handleInputChange('relationship', e.target.value)}
                                                className="w-full py-3 sm:py-4 px-4 bg-white/10 border border-white/20 text-white text-sm sm:text-base rounded-xl backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 appearance-none min-h-[48px]"
                                            >
                                                <option value="" className="bg-black text-white">Selecione</option>
                                                <option value="mãe" className="bg-black text-white">Minha mãe</option>
                                                <option value="pai" className="bg-black text-white">Meu pai</option>
                                                <option value="namorada" className="bg-black text-white">Minha namorada</option>
                                                <option value="namorado" className="bg-black text-white">Meu namorado</option>
                                                <option value="esposa" className="bg-black text-white">Minha esposa</option>
                                                <option value="esposo" className="bg-black text-white">Meu esposo</option>
                                                <option value="avó" className="bg-black text-white">Minha avó</option>
                                                <option value="avô" className="bg-black text-white">Meu avô</option>
                                                <option value="irmã" className="bg-black text-white">Minha irmã</option>
                                                <option value="irmão" className="bg-black text-white">Meu irmão</option>
                                                <option value="amiga" className="bg-black text-white">Minha amiga</option>
                                                <option value="amigo" className="bg-black text-white">Meu amigo</option>
                                                <option value="prima" className="bg-black text-white">Minha prima</option>
                                                <option value="primo" className="bg-black text-white">Meu primo</option>
                                                <option value="filha" className="bg-black text-white">Minha filha</option>
                                                <option value="filho" className="bg-black text-white">Meu filho</option>
                                                <option value="tia" className="bg-black text-white">Minha tia</option>
                                                <option value="tio" className="bg-black text-white">Meu tio</option>
                                            </select>
                                        </div>

                                        {/* Qual a ocasião */}
                                        <div>
                                            <label className="block text-white text-sm sm:text-base font-medium mb-2">
                                                Qual a ocasião?
                                            </label>
                                            <select
                                                value={formData.occasion}
                                                onChange={(e) => handleInputChange('occasion', e.target.value)}
                                                className="w-full py-3 sm:py-4 px-4 bg-white/10 border border-white/20 text-white text-sm sm:text-base rounded-xl backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 appearance-none min-h-[48px]"
                                            >
                                                <option value="" className="bg-black text-white">Selecione</option>
                                                <option value="aniversário" className="bg-black text-white">Aniversário</option>
                                                <option value="dia das mães" className="bg-black text-white">Dia das Mães</option>
                                                <option value="dia dos pais" className="bg-black text-white">Dia dos Pais</option>
                                                <option value="dia dos namorados" className="bg-black text-white">Dia dos Namorados</option>
                                                <option value="declaração de amor" className="bg-black text-white">Declaração de amor</option>
                                                <option value="agradecimento" className="bg-black text-white">Agradecimento</option>
                                                <option value="saudade" className="bg-black text-white">Saudade</option>
                                                <option value="sem ocasião específica" className="bg-black text-white">Sem ocasião específica</option>
                                            </select>
                                        </div>

                                        {/* Nome da pessoa (condicional) */}
                                        {showPersonNameField && (
                                            <div>
                                                <label className="block text-white text-sm sm:text-base font-medium mb-2">
                                                    Nome da pessoa
                                                </label>
                                                <Input
                                                    placeholder="Ex: Maria, João..."
                                                    value={formData.personName}
                                                    onChange={(e) => handleInputChange('personName', e.target.value)}
                                                    className="w-full py-3 sm:py-4 px-4 bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base rounded-xl backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 min-h-[48px]"
                                                />
                                            </div>
                                        )}

                                        {/* Tom da mensagem */}
                                        <div>
                                            <label className="block text-white text-sm sm:text-base font-medium mb-2">
                                                Tom da mensagem
                                            </label>
                                            <select
                                                value={formData.tone}
                                                onChange={(e) => handleInputChange('tone', e.target.value)}
                                                className="w-full py-3 sm:py-4 px-4 bg-white/10 border border-white/20 text-white text-sm sm:text-base rounded-xl backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 appearance-none min-h-[48px]"
                                            >
                                                <option value="" className="bg-black text-white">Selecione</option>
                                                <option value="romântico" className="bg-black text-white">Romântico</option>
                                                <option value="engraçado" className="bg-black text-white">Engraçado</option>
                                                <option value="nostálgico" className="bg-black text-white">Nostálgico</option>
                                                <option value="inspirador" className="bg-black text-white">Inspirador</option>
                                                <option value="emotivo" className="bg-black text-white">Emotivo</option>
                                                <option value="carinhoso" className="bg-black text-white">Carinhoso</option>
                                                <option value="respeitoso" className="bg-black text-white">Respeitoso</option>
                                                <option value="divertido" className="bg-black text-white">Divertido</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Nome do remetente - campo único */}
                                    <div>
                                        <label className="block text-white text-sm sm:text-base font-medium mb-2">
                                            Seu nome
                                        </label>
                                        <Input
                                            placeholder="Como você gostaria de assinar a mensagem?"
                                            value={formData.senderName}
                                            onChange={(e) => handleInputChange('senderName', e.target.value)}
                                            className="w-full py-3 sm:py-4 px-4 bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base rounded-xl backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-white/30 min-h-[48px]"
                                        />
                                    </div>
                                </div>

                                {/* Botão de ação - Apple Style */}
                                <div className="pt-8">
                                    <Button
                                        className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-4 sm:py-5 rounded-2xl font-medium shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
                                        onClick={generatePersonalizedMessage}
                                        disabled={loading || !canProceed()}
                                    >
                                        {loading ? (
                                            <LoaderCircle className='animate-spin mr-2'/>
                                        ) : (
                                            <Heart className='mr-2'/>
                                        )}
                                        <span>Criar Vídeo Personalizado</span>
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default MothersDay
