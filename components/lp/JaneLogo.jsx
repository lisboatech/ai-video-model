'use client'

import React from 'react';

export const JaneLogo = () => {
  return (
    <div className="relative group hover:scale-105 transition-all duration-700 scale-75">
      <div className="relative z-10 flex items-center">
        {/* Letras com tipografia ultra futurista inspirada na SF Pro Display */}
        <div className="flex tracking-[-0.01em]">
          <span className="text-[28px] font-thin uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/80 tracking-tight leading-none">J</span>
          <span className="text-[28px] font-thin uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/80 tracking-tight leading-none ml-[0.1em]">A</span>
          <span className="text-[28px] font-thin uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/80 tracking-tight leading-none ml-[0.1em]">N</span>
          <span className="text-[28px] font-thin uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/80 tracking-tight leading-none ml-[0.1em]">E</span>
        </div>

        {/* Linha decorativa premium */}
        <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/90 to-transparent"></div>

        {/* Efeito de brilho sutil constante */}
        <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/20 blur-sm"></div>
      </div>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 blur-md transition-all duration-700 z-0"></div>
    </div>
  );
};

export default JaneLogo;
