import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/shared/lib/providers";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
  title: "Brain Agriculture - Gestão de Produtores Rurais",
  description: "Sistema de gestão de produtores rurais e propriedades agrícolas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>
          <AppProviders>{children}</AppProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
