"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import JaneLogo from "./JaneLogo";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Início", link: "#hero" },
    { name: "Recursos", link: "#features" },
    { name: "Como Funciona", link: "#how-it-works" },
    { name: "Preços", link: "#pricing" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 py-4 px-4 md:px-6">
      <div
        className={cn(
          "max-w-7xl mx-auto flex justify-between items-center py-3 px-5 transition-all duration-500",
          isScrolled
            ? "bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="relative group flex items-center">
            <div className="absolute -inset-3 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            <div className="flex items-center">
              <JaneLogo />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link
                href={item.link}
                className="text-white/70 hover:text-white text-sm font-light transition-colors duration-300 relative group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* CTA Button - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:block"
        >
          <Link href="/workspace">
            <div className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
              <button className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-light transition-all duration-300 overflow-hidden group-hover:bg-white/20">
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Criar Experiência</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M13.75 6.75L19.25 12L13.75 17.25M4.75 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4"
        >
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mx-4 p-6">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white text-base font-light transition-colors duration-300 py-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Link href="/workspace" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-light transition-all duration-300 hover:bg-white/20">
                    Criar Experiência
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}
