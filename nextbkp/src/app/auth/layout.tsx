import { isAuthenticated } from "@/auth/auth";
import ThemeToggle from "@/components/theme/theme-toggle";
import { redirect } from "next/navigation";
import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-foreground p-10 text-background dark:bg-background dark:text-foreground">
        <div className="flex items-center gap-3 text-lg">
          <span className="font-semibold">Controle de Estoque</span>
        </div>

        <footer className="text-sm">
          Lucas Fernando Quinato de Camargo &copy; Controle de Estoque -{" "}
          {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted dark:bg-muted">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
