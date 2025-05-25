import Image from "next/image";

export default function Features() {
  // Array de recursos para renderização dinâmica
  const features = [
    {
      id: "01",
      title: "Mensagens Personalizadas",
      description: "Mensagens emocionantes geradas por IA e personalizáveis para expressar exatamente o que você sente.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "02",
      title: "Narração Emocionante",
      description: "Escolha entre vozes femininas e masculinas para narrar sua mensagem com o tom perfeito.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "03",
      title: "Música de Fundo",
      description: "Trilhas sonoras cuidadosamente selecionadas para complementar a emoção da sua mensagem.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M12 3L12.01 13.55C11.42 13.21 10.74 13 10.01 13C7.8 13 6.01 14.79 6.01 17C6.01 19.21 7.8 21 10.01 21C12.22 21 14.01 19.21 14.01 17V7H18.01V3H12ZM10.01 19C8.91 19 8.01 18.1 8.01 17C8.01 15.9 8.91 15 10.01 15C11.11 15 12.01 15.9 12.01 17C12.01 18.1 11.11 19 10.01 19ZM16 3V11H18V3H16ZM20 3V11H22V3H20Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "04",
      title: "Imagens Significativas",
      description: "Adicione fotos especiais que marcaram a história de vocês para uma experiência visual personalizada.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "05",
      title: "Compartilhamento Fácil",
      description: "Compartilhe diretamente pelo WhatsApp ou baixe o vídeo para enviar como preferir.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "06",
      title: "Sem Necessidade de Cadastro",
      description: "Processo simples e rápido, sem necessidade de criar conta ou fornecer dados pessoais.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary group-hover:scale-110 transition-transform duration-500">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div id="features" className="py-24 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/[0.02] to-black/0 pointer-events-none"></div>

      {/* Section header */}
      <div className="text-center mb-16 relative">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-light tracking-[0.2em] mb-4 backdrop-blur-sm">
          RECURSOS
        </div>

        <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
          Tudo o que você precisa
        </h2>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent mx-auto"></div>

        <p className="text-white/60 max-w-xl mx-auto mt-6 text-sm font-light">
          Recursos exclusivos para criar uma experiência inesquecível para qualquer ocasião especial
        </p>
      </div>

      {/* Features grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="group relative">
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

              {/* Card */}
              <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-500 group-hover:translate-y-[-5px] group-hover:shadow-lg group-hover:shadow-primary/5 h-full">
                {/* Feature number */}
                <div className="absolute top-4 right-4 text-xs font-light text-white/20">{feature.id}</div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mb-4 group-hover:from-primary/20 transition-all duration-500 border border-white/5">
                  {feature.icon}
                </div>

                {/* Title with decorative line */}
                <div className="relative mb-3">
                  <h3 className="text-lg font-light mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-gradient-to-r from-primary/50 to-transparent group-hover:w-12 transition-all duration-500"></div>
                </div>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example preview */}
      <div className="max-w-4xl mx-auto mt-20 px-4">
        <div className="relative">
          {/* Decorative frame */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-lg opacity-30"></div>

          {/* Preview container */}
          <div className="relative bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="aspect-video w-full relative">
              {/* Placeholder for video preview */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40">
                <div className="text-center space-y-4 px-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-white/90 text-sm font-light">
                    Veja como funciona
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
