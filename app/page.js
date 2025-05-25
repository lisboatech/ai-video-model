import {
  Header,
  Hero,
  Features,
  Pricing,
  Footer,
  Background,
  HowItWorks,
} from "../components/lp";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Efeitos de fundo futurísticos */}
      <Background />

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-5xl w-full mx-auto">
          <Header />
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <Footer />
        </div>
      </div>
    </div>
  );
}
