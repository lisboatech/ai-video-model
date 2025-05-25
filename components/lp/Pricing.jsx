import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function Pricing() {
  // Lista de benefícios
  const benefits = [
    {
      title: "Sem necessidade de cadastro",
      description: "Processo simples e rápido, sem criar conta"
    },
    {
      title: "Compartilhamento ilimitado",
      description: "Envie para quantas pessoas quiser"
    },
    {
      title: "Download em alta qualidade",
      description: "Vídeo em resolução perfeita para qualquer dispositivo"
    }
  ];

  return (
    <div id="pricing" className="py-24 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/[0.01] to-black/0 pointer-events-none"></div>

      {/* Section header */}
      <div className="text-center mb-16 relative">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-light tracking-[0.2em] mb-4 backdrop-blur-sm">
          PREÇO
        </div>

        <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
          Investimento Único
        </h2>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent mx-auto"></div>
      </div>

      {/* Main pricing container - Centered card */}
      <div className="max-w-xl mx-auto px-4">
        <div className="relative group">
          {/* Hover effect */}
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-lg"></div>

          {/* Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-md rounded-3xl border border-white/10 transition-all duration-500 group-hover:border-white/20 p-8">
            {/* Decorative elements */}
            <div className="absolute top-0 left-[10%] w-[1px] h-[30px] bg-gradient-to-b from-primary/30 to-transparent"></div>
            <div className="absolute top-0 right-[10%] w-[1px] h-[30px] bg-gradient-to-b from-primary/30 to-transparent"></div>
            <div className="absolute bottom-0 left-[10%] w-[1px] h-[30px] bg-gradient-to-t from-primary/30 to-transparent"></div>
            <div className="absolute bottom-0 right-[10%] w-[1px] h-[30px] bg-gradient-to-t from-primary/30 to-transparent"></div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-xs font-light text-white/50 mb-1">PREÇO ÚNICO</div>
              <div className="text-5xl font-extralight text-white mb-1">R$<span className="text-primary font-normal">1</span>,00</div>
              <div className="text-xs font-light text-white/40">Pagamento único</div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/90 font-light">{benefit.title}</div>
                    <div className="text-xs text-white/50">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm text-center font-light mb-8">
              Crie uma experiência única que vai emocionar a pessoa amada em qualquer ocasião especial.
              Uma lembrança digital que poderá ser guardada para sempre.
            </p>

            {/* CTA Button */}
            <div className="text-center">
              <Link href="/workspace" className="group">
                <Button className="w-full rounded-full px-8 py-6 text-base font-light bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 group-hover:translate-y-[-2px]">
                  <span className="mr-2">Criar Agora</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.01 11H4V13H16.01V16L20 12L16.01 8V11Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
