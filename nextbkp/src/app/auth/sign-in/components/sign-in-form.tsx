"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInAction } from "../actions/sign-in-action";
import { signInSchema, type SignInFormData } from "../lib/validations";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Verificar se veio de outra página e mostrar mensagem de sucesso
  useEffect(() => {
    const email = searchParams.get("email");
    const fromPage = searchParams.get("from");

    if (email) {
      setValue("email", email);
    }

    if (fromPage === "signup") {
      setSuccessMessage(
        "Conta criada com sucesso! Agora você pode fazer login com suas credenciais."
      );
      setShowSuccessMessage(true);
    } else if (fromPage === "forgot-password") {
      setSuccessMessage(
        "Email de recuperação enviado! Verifique sua caixa de entrada e spam."
      );
      setShowSuccessMessage(true);
    } else if (fromPage === "reset-password") {
      setSuccessMessage(
        "Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha."
      );
      setShowSuccessMessage(true);
    }

    if (fromPage) {
      // Remove os parâmetros da URL após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/auth/sign-in", { scroll: false });
      }, 5000);
    }
  }, [searchParams, setValue, router]);

  const emailWatch = watch("email");
  const passwordWatch = watch("password");

  const activeButton = Boolean(emailWatch && passwordWatch && !isSubmitting);

  async function onSubmit(data: SignInFormData) {
    setError(null);

    try {
      const result = await signInAction(data);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Erro inesperado. Tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            <p className="text-sm text-destructive">{errors.email.message}</p>
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
    </div>
  );
}
