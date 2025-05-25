'use client'

import React from 'react'

export const HeaderSphere = () => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Efeito de brilho em torno da esfera */}
      <div className="absolute -inset-1 bg-[#FF2D55]/[0.05] blur-xl rounded-full opacity-50"></div>

      {/* Círculo vermelho sólido - exatamente como na imagem compartilhada */}
      <div className="w-[30px] h-[30px] rounded-full bg-[#FF2D55]"></div>
    </div>
  )
}

export default HeaderSphere
