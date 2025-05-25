import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Personalize a mensagem",
      description: "Nossa IA vai sugerir mensagens emocionantes que você pode personalizar.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      number: "02",
      title: "Escolha uma foto especial",
      description: "Selecione uma imagem que represente um momento especial com a pessoa amada.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      number: "03",
      title: "Escolha a narração e música",
      description: "Selecione a voz e a música de fundo que melhor combinam com sua mensagem.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      number: "04",
      title: "Compartilhe a experiência",
      description: "Envie diretamente via WhatsApp ou baixe para compartilhar como preferir.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div id="how-it-works" className="py-24 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/[0.02] to-black/0 pointer-events-none"></div>

      {/* Section header */}
      <div className="text-center mb-16 relative">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-light tracking-[0.2em] mb-4 backdrop-blur-sm">
          COMO FUNCIONA
        </div>

        <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
          Crie em poucos minutos
        </h2>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent mx-auto"></div>

        <p className="text-white/60 max-w-xl mx-auto mt-6 text-sm font-light">
          Processo simples e rápido para criar uma experiência inesquecível
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Step card */}
              <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-500 group-hover:translate-y-[-5px] group-hover:shadow-lg group-hover:shadow-primary/5 h-full">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-xs font-light text-white/20">{step.number}</div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mb-6 group-hover:from-primary/20 transition-all duration-500 border border-white/5">
                  {step.icon}
                </div>

                {/* Title with decorative line */}
                <div className="relative mb-4">
                  <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-gradient-to-r from-primary/50 to-transparent group-hover:w-12 transition-all duration-500"></div>
                </div>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Connection line between steps (only for desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-primary/30 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
