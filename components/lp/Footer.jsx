import Link from "next/link";
import Image from "next/image";
import JaneLogo from "./JaneLogo";

export default function Footer() {
  // Links do rodapé
  const footerLinks = [
    { href: "#", label: "Termos" },
    { href: "#", label: "Privacidade" },
    { href: "#", label: "Suporte" }
  ];

  // Links de redes sociais
  const socialLinks = [
    {
      href: "#",
      label: "Instagram",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
        </svg>
      )
    },
    {
      href: "#",
      label: "Twitter",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="currentColor"/>
        </svg>
      )
    },
    {
      href: "#",
      label: "Facebook",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="py-16 mt-16 relative">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left column - Logo and description */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block relative group">
              <div className="absolute -inset-2 bg-primary/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <JaneLogo
                alt="Jane"
                width={100}
                height={26}
                className="relative hover:opacity-90 transition-opacity duration-300"
              />
            </Link>

            {/* Description */}
            <p className="text-sm text-white/50 font-light max-w-xs">
              Crie experiências emocionantes para o Dia das Mães com mensagens personalizadas, narração e música.
            </p>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-colors duration-300"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Middle column - Quick links */}
          <div>
            <h3 className="text-sm font-medium text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/workspace" className="text-sm text-white/50 hover:text-primary transition-colors duration-300">
                  Criar Experiência
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-white/50 hover:text-primary transition-colors duration-300">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm text-white/50 hover:text-primary transition-colors duration-300">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-white/50 hover:text-primary transition-colors duration-300">
                  Preço
                </Link>
              </li>
            </ul>
          </div>

          {/* Right column - Legal links */}
          <div>
            <h3 className="text-sm font-medium text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/50 hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section - Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-white/40 font-light">
            <span className="text-primary/70">©</span> 2024 Jane. Todos os direitos reservados.
          </div>

          <div className="mt-4 md:mt-0 text-xs text-white/40">
            Feito com ❤️ para todas as mães
          </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
    </footer>
  );
}
