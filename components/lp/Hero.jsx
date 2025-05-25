'use client'

import React from 'react'
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import { VisualizationSphere } from "../../app/workspace/components/sphere";

export default function Hero() {
  return (
    <div id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects - Futuristic iPhone 20 style */}
      <div className="absolute inset-0 bg-black z-0"></div>

      {/* Futuristic gradients with primary color */}
      <div className="absolute top-0 right-0 w-full h-full opacity-30 z-0">
        <div className="absolute top-0 right-0 w-[70%] h-[60%] bg-primary/10 rounded-full blur-[180px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[50%] bg-primary/5 rounded-full blur-[200px] animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Holographic light effects with primary color */}
      <div className="absolute top-[15%] right-[10%] h-0 w-[40rem] shadow-[0_0_800px_30px_rgba(220,38,38,0.15)] -rotate-[30deg] z-0"></div>
      <div className="absolute bottom-[20%] left-[15%] h-0 w-[20rem] shadow-[0_0_400px_15px_rgba(220,38,38,0.1)] rotate-[20deg] z-0"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03] mix-blend-overlay z-0"></div>

      {/* Main content container - Coffee Delivery style */}
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Content - Left Column */}
          <div className="space-y-7">
            {/* Tag - Original style */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="text-primary text-[11px] font-light tracking-wide">PARA QUALQUER OCASIÃO ESPECIAL</span>
            </div>

            {/* Title - Futuristic Apple iPhone 20 style typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white">
              Experiência<br/>
              <span className="text-white font-normal">inesquecível.</span>
            </h1>

            {/* Description - Futuristic Apple style clean typography */}
            <p className="text-lg text-white/70 max-w-md leading-relaxed font-light">
              Crie uma mensagem que combina texto, imagens e música em uma
              experiência visual única para qualquer pessoa que você ama.
            </p>

            {/* CTA section - Coffee Delivery style */}
            <div className="flex flex-row items-center gap-4 pt-2">
              <Link href="/workspace">
                <div className="relative group">
                  {/* Subtle red glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-primary/0 group-hover:bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  {/* White button with Apple-style arrow */}
                  <Button className="relative rounded-full px-8 py-6 text-base font-normal bg-white text-black hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-primary/20">
                    <span className="mr-2">Criar Agora</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform duration-300">
                      <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </div>
              </Link>

              {/* Saiba mais link with Apple-style arrow */}
              <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                <span className="border-b border-transparent group-hover:border-white/30 transition-all duration-300">Saiba mais</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M6.5 1.5L11 6L6.5 10.5M1 6H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero Image - Right Column */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Sphere container with floating animation */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* 3D Sphere Component */}
                <div className="relative">
                  {/* Subtle glow effect - Responsive */}
                  <div className="absolute -inset-4 lg:-inset-6 bg-primary/5 blur-2xl rounded-full opacity-40"></div>

                  {/* Sphere - Responsive size */}
                  <div className="transform-gpu">
                    <div className="block lg:hidden">
                      {/* Mobile: 350px */}
                      <VisualizationSphere size={350} />
                    </div>
                    <div className="hidden lg:block">
                      {/* Desktop: 450px */}
                      <VisualizationSphere size={450} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Subtle reflection - Responsive */}
              <div className="absolute bottom-[-15px] left-[120px] right-[120px] lg:left-[100px] lg:right-[100px] h-[8px] bg-primary/10 blur-lg rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
