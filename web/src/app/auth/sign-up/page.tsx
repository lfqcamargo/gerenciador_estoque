"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateCNPJ } from "@/utils/validate-cnpj";

const signUpForm = z
  .object({
    cnpj: z
      .string({
        required_error: "CNPJ é obrigatório",
        invalid_type_error: "CNPJ deve ser uma string",
      })
      .min(14, "CNPJ deve ter 14 caracteres")
      .max(18, "CNPJ inválido")
      .transform((cnpj) => cnpj.replace(/\D/g, "")) // Remove caracteres não numéricos
      .refine((cnpj) => cnpj.length === 14, {
        message: "CNPJ deve ter exatamente 14 dígitos",
      })
      .refine((cnpj) => validateCNPJ(cnpj), {
        message: "CNPJ inválido",
      }),

    companyName: z
      .string({
        required_error: "Nome da empresa é obrigatório",
        invalid_type_error: "Nome da empresa deve ser uma string",
      })
      .min(3, "Nome da empresa deve ter pelo menos 3 caracteres")
      .max(255, "Nome da empresa deve ter no máximo 255 caracteres")
      .transform((name) => name.trim()),

    email: z
      .string({
        required_error: "Email é obrigatório",
        invalid_type_error: "Email deve ser uma string",
      })
      .email("Formato de email inválido")
      .min(5, "Email deve ter pelo menos 5 caracteres")
      .max(255, "Email deve ter no máximo 255 caracteres")
      .transform((email) => email.toLowerCase().trim()),

    userName: z
      .string({
        required_error: "Nome do usuário é obrigatório",
        invalid_type_error: "Nome do usuário deve ser uma string",
      })
      .min(3, "Nome do usuário deve ter pelo menos 3 caracteres")
      .max(255, "Nome do usuário deve ter no máximo 255 caracteres")
      .transform((name) => name.trim()),

    password: z
      .string({
        required_error: "Senha é obrigatória",
        invalid_type_error: "Senha deve ser uma string",
      })
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),

    confirmPassword: z.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpForm>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  });

  const router = useRouter();

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
      !isSubmitting
  );

  const onSubmit = async (data: SignUpForm) => {
    try {
      console.log("Sign up data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push(
        `/auth/sign-in?email=${encodeURIComponent(data.email)}&from=signup`
      );
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-12 py-8">
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/30">
          <User className="h-12 w-12 text-primary" />
        </div>
      </div>

      <Card className="w-full max-w-[500px] border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
        <CardHeader className="space-y-2 pb-4 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Criar conta grátis
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Seja um parceiro e comece suas vendas!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    disabled={isSubmitting}
                    {...register("cnpj")}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <Button
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    {...register("confirmPassword")}
                  />
                  <Button
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    disabled={isSubmitting}
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
              {isSubmitting ? "Processando..." : "CADASTRAR"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-4 flex w-full max-w-[500px] items-center justify-center space-x-2">
        <span className="text-muted-foreground">Já tem uma conta?</span>
        <Button
          variant="ghost"
          asChild
          className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/90"
        >
          <Link href="/auth/sign-in">Faça Login</Link>
        </Button>
      </div>
    </div>
  );
}
