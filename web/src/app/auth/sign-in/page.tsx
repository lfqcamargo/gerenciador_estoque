"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LockKeyhole, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signInForm = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Formato de email inválido")
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type SignInForm = z.infer<typeof signInForm>;

export default function SignIn() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const fromPage = searchParams.get("from");

    if (email) {
      setValue("email", email);
    }

    if (fromPage === "signup") {
      setSuccessMessage(
        "Conta criada com sucesso! Entre no seu e-mail para confirmar sua conta."
      );
      setShowSuccessMessage(true);
    } else if (fromPage === "forgot-password") {
      setSuccessMessage(
        "Email de recuperação enviado! Verifique sua caixa de entrada e spam."
      );
      setShowSuccessMessage(true);
    }

    if (fromPage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/auth/sign-in", { scroll: false });
      }, 5000);
    }
  }, [searchParams, setValue, router]);

  const emailWatch = watch("email");
  const passwordWatch = watch("password");

  const activeButton = Boolean(emailWatch && passwordWatch && !isSubmitting);

  const onSubmit = async (data: SignInForm) => {
    try {
      console.log("Login data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="mb-6 w-full max-w-[500px]">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex w-full flex-col items-center px-12 py-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30">
            <LockKeyhole className="h-12 w-12 text-primary" />
          </div>
        </div>

        <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Acessar painel
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Acompanhe suas finanças pelo painel do FinControl!
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-base font-medium text-foreground"
                >
                  Seu e-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="h-12 border-input bg-background pl-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-base font-medium text-foreground"
                >
                  Sua senha
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 border-input bg-background pl-10 pr-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...register("rememberMe")}
                    disabled={isSubmitting}
                    className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-input/70"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="cursor-pointer text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar-me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80 dark:text-primary dark:hover:text-primary/90"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button
                disabled={!activeButton}
                className="h-12 w-full bg-primary text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                type="submit"
              >
                {isSubmitting ? "Processando..." : "Acessar painel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex w-full max-w-[500px] justify-between">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:bg-background/10 dark:hover:text-foreground"
          >
            <Link href="/auth/help" className="text-sm">
              Precisa de ajuda?
            </Link>
          </Button>

          <Button
            variant="default"
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            <Link href="/auth/sign-up">Criar conta</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
