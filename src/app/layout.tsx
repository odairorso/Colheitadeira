import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Fonte mais limpa e arredondada
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Colheitadeira Web",
  description: "Gerencie receitas e despesas da sua colheitadeira de forma prática e rápida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} antialiased bg-black selection:bg-emerald-500/30`}>
        {children}
      </body>
    </html>
  );
}
