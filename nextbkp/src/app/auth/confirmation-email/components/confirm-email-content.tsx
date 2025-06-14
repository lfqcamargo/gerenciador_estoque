"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { confirmEmailAction } from "../actions/confirm-email-action";

type ConfirmationState = "loading" | "success" | "error";

export function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmationState>("loading");
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setState("error");
      return;
    }

    confirmEmail(token);
  }, [searchParams]);

  async function confirmEmail(token: string) {
    try {
      const result = await confirmEmailAction(token);

      if (result.success) {
        setState("success");
      } else {
        setState("error");
      }
    } catch (error) {
      console.error("Confirm email error:", error);
      setState("error");
    }
  }

  function handleSignIn() {
    router.push(
      `/auth/sign-in?email=${encodeURIComponent(
        searchParams.get("email") || ""
      )}`
    );
  }

  if (state === "loading") {
    return (
      <div className="flex w-full flex-col items-center px-12 py-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Verificando email
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Aguarde enquanto confirmamos sua conta...
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">
                Processando confirmação...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex w-full flex-col items-center px-12 py-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Email confirmado!
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sua conta foi ativada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Parabéns! Sua conta foi confirmada e já está ativa. Agora você
                pode fazer login e começar a usar nossa plataforma.
              </p>
              <Button
                onClick={handleSignIn}
                className="w-full h-12 bg-primary text-base font-medium"
              >
                Fazer login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center px-12 py-8">
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
      </div>

      <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
        <CardHeader className="space-y-2 pb-4 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Erro na confirmação
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Ocorreu um erro ao confirmar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              Token não encontrado ou já expirado. Tente criar novamente a
              conta.
            </p>

            <div className="space-y-3">
              <Button
                asChild
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-primary text-base font-medium"
              >
                <Link href="/auth/sign-up">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Criar nova conta
                </Link>
              </Button>

              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full h-12">
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
