export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradiente principal */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black to-[#050505]"></div>
      
      {/* Grid futurístico sutil */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-[0.03] mix-blend-overlay"></div>
      
      {/* Efeitos de luz futurísticos */}
      <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[5%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[130px] opacity-30 animate-pulse-slow animation-delay-2000"></div>
      
      {/* Linhas futurísticas */}
      <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      {/* Partículas sutis (simuladas com elementos fixos) */}
      <div className="absolute top-[20%] left-[30%] w-[2px] h-[2px] rounded-full bg-white/30 animate-pulse-slow"></div>
      <div className="absolute top-[40%] left-[70%] w-[1px] h-[1px] rounded-full bg-white/20 animate-pulse-slow animation-delay-1000"></div>
      <div className="absolute top-[70%] left-[20%] w-[1px] h-[1px] rounded-full bg-white/20 animate-pulse-slow animation-delay-3000"></div>
      <div className="absolute top-[60%] left-[80%] w-[2px] h-[2px] rounded-full bg-white/30 animate-pulse-slow animation-delay-2500"></div>
      <div className="absolute top-[30%] left-[50%] w-[1px] h-[1px] rounded-full bg-white/20 animate-pulse-slow animation-delay-1500"></div>
    </div>
  );
}
