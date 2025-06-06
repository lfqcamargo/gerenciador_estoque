"use client";
import { useState, useTransition } from "react";
import type React from "react";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUpAction } from "../actions/sign-up-action";
import { signUpSchema, type SignUpFormData } from "../lib/validations";
import { formatCNPJ } from "@/utils/validate-cnpj";

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const cnpjWatch = watch("cnpj");
  const companyNameWatch = watch("companyName");
  const emailWatch = watch("email");
  const userNameWatch = watch("userName");
  const passwordWatch = watch("password");
  const confirmPasswordWatch = watch("confirmPassword");

  const activeButton = Boolean(
    cnpjWatch &&
      companyNameWatch &&
      emailWatch &&
      userNameWatch &&
      passwordWatch &&
      confirmPasswordWatch &&
      !isPending
  );

  // Formatação automática do CNPJ
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = formatCNPJ(value);
    setValue("cnpj", formatted);
  };

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await signUpAction(data);

        if (result.success) {
          router.push(
            `/auth/sign-in?email=${encodeURIComponent(data.email)}&from=signup`
          );
        } else {
          setError(result.message || "Erro interno do servidor");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        setError("Erro inesperado. Tente novamente.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="cnpj"
            className="text-base font-medium text-foreground"
          >
            CNPJ da Empresa
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cnpj"
              type="text"
              className="h-12 border-input bg-background pl-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
              placeholder="00.000.000/0000-00"
              disabled={isPending}
              {...register("cnpj")}
              onChange={handleCNPJChange}
              maxLength={18}
            />
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.cnpj?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="companyName"
            className="text-base font-medium text-foreground"
          >
            Nome da Empresa
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="companyName"
              type="text"
              className="h-12 border-input bg-background pl-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
              placeholder="Nome da sua empresa"
              disabled={isPending}
              {...register("companyName")}
            />
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.companyName?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="userName"
            className="text-base font-medium text-foreground"
          >
            Nome do Usuário
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="userName"
              type="text"
              className="h-12 border-input bg-background pl-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
              placeholder="Seu nome de usuário"
              disabled={isPending}
              {...register("userName")}
            />
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.userName?.message}
          </p>
        </div>

        <div className="space-y-2">
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
              disabled={isPending}
              {...register("email")}
            />
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.email?.message}
          </p>
        </div>

        <div className="space-y-2">
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
              placeholder="Mínimo de 8 caracteres"
              disabled={isPending}
              {...register("password")}
            />
            <Button
              tabIndex={-1}
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
            >
              {showPassword ? (
                <EyeOff focusable={"false"} className="h-5 w-5" />
              ) : (
                <Eye focusable={"false"} className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.password?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-base font-medium text-foreground"
          >
            Confirme sua senha
          </Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showRepeatPassword ? "text" : "password"}
              className="h-12 border-input bg-background pl-10 pr-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
              placeholder="Repita sua senha"
              disabled={isPending}
              {...register("confirmPassword")}
            />
            <Button
              tabIndex={-1}
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              disabled={isPending}
            >
              {showRepeatPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="min-h-[16px] pl-1 mb-2 text-sm text-destructive">
            {errors.confirmPassword?.message}
          </p>
        </div>
      </div>

      <Button
        disabled={!activeButton}
        className="mt-6 h-12 w-full bg-primary text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        type="submit"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "CADASTRAR"
        )}
      </Button>
    </form>
  );
}
