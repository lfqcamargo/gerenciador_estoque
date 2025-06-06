"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { confirmEmailAction } from "../actions/confirm-email-action";
import { resendConfirmationAction } from "../actions/resend-confirmation-action";

type ConfirmationState =
  | "loading"
  | "success"
  | "invalid"
  | "expired"
  | "error";

export function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmationState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setState("invalid");
      return;
    }

    confirmEmail(token);
  }, [searchParams]);

  const confirmEmail = async (token: string) => {
    try {
      const result = await confirmEmailAction(token);

      if (result.success) {
        setState("success");
        if (result.email) {
          setEmail(result.email);
        }
      } else {
        if (result.error === "TOKEN_EXPIRED") {
          setState("expired");
        } else if (result.error === "TOKEN_INVALID") {
          setState("invalid");
        } else {
          setState("error");
        }

        if (result.email) {
          setEmail(result.email);
        }
      }
    } catch (error) {
      console.error("Confirm email error:", error);
      setState("error");
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const result = await resendConfirmationAction(email);

      if (result.success) {
        setResendSuccess(true);
      }
    } catch (error) {
      console.error("Resend confirmation error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    if (email) {
      router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/auth/sign-in");
    }
  };

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

              {email && (
                <p className="text-sm text-muted-foreground">
                  Email confirmado:{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              )}

              <Button
                onClick={handleGoToLogin}
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

  if (state === "expired") {
    return (
      <div className="flex w-full flex-col items-center px-12 py-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Link expirado
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              O link de confirmação não é mais válido
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="space-y-4">
              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Novo email de confirmação enviado! Verifique sua caixa de
                    entrada.
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-muted-foreground text-center">
                O link de confirmação expirou. Links de confirmação são válidos
                por 24 horas por motivos de segurança.
              </p>

              {email && (
                <p className="text-sm text-muted-foreground text-center">
                  Email:{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              )}

              <div className="space-y-3">
                {email && (
                  <Button
                    onClick={handleResendConfirmation}
                    disabled={isResending || resendSuccess}
                    className="w-full h-12 bg-primary text-base font-medium"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : resendSuccess ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Email enviado
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reenviar confirmação
                      </>
                    )}
                  </Button>
                )}

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

  if (state === "invalid") {
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
              Link inválido
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              O link de confirmação não é válido
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                O link de confirmação é inválido ou já foi usado. Verifique se
                você copiou o link completo do email.
              </p>

              <div className="space-y-3">
                <Link href="/auth/sign-up">
                  <Button className="w-full h-12 bg-primary text-base font-medium">
                    Criar nova conta
                  </Button>
                </Link>

                <Link href="/auth/sign-in">
                  <Button variant="outline" className="w-full h-12">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // state === "error"
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
              Ocorreu um erro inesperado ao confirmar sua conta. Tente novamente
              mais tarde ou entre em contato com o suporte.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-primary text-base font-medium"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
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
