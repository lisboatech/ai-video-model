import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "../components/ui/sonner";

export const metadata = {
  title: "Jane",
  description: "Crie uma experiência sinestésica emocionante para o Dia das Mães",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
