import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-foreground p-10 text-background dark:bg-background dark:text-foreground">
        <div className="flex items-center gap-3 text-lg">
          <span className="font-semibold">Controle de Finanças</span>
        </div>

        <footer className="text-sm">
          Lucas Fernando Quinato de Camargo &copy; Controle de Finanças -{" "}
          {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted dark:bg-muted">
        {children}
      </div>
    </div>
  );
}
