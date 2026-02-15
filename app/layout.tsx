import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SPIE Elige",
  description: "Sistema de votaciones del grupo estudiantil SPIE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-border px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                S
              </div>
              <h1 className="text-xl font-bold text-primary">SPIE Elige</h1>
            </div>
            <nav className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </a>
              <a
                href="/admin-panel/login"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
            SPIE Elige — Grupo estudiantil SPIE
          </footer>
        </div>
      </body>
    </html>
  );
}
