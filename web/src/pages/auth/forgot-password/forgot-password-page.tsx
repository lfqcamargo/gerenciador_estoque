"use client";
import { Suspense } from "react";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordPage() {
  return (
    <div className="flex w-full flex-col items-center px-12 py-8">
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30">
          <Mail className="h-12 w-12 text-primary" />
        </div>
      </div>

      <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
        <CardHeader className="space-y-2 pb-4 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Recuperar senha
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Informe seu email para receber o link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Suspense fallback={<div>Carregando...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
