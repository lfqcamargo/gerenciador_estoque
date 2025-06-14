"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordAction } from "../actions/reset-password-action";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../lib/validations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConfirmationEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(
        "Token de redefinição não encontrado. Solicite um novo link de recuperação."
      );
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleResetPassword(data: ResetPasswordFormData) {
    if (!token) {
      setError(
        "Token de redefinição não encontrado. Solicite um novo link de recuperação."
      );
      return;
    }

    setError(null);

    try {
      const result = await resetPasswordAction({
        token,
        password: data.password,
      });
      if (result.success) {
        setIsPasswordReset(true);
      } else {
        setError(result.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Erro inesperado. Tente novamente.");
    }
  }

  if (isPasswordReset) {
    return (
      <div className="w-full">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <Card className="w-full border border-border bg-card shadow-lg dark:border-border/30 dark:bg-card/95">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Senha redefinida!
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sua senha foi alterada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Sua senha foi alterada com sucesso. Agora você pode fazer login
                com sua nova senha.
              </p>

              <Button
                onClick={() => router.push("/auth/sign-in")}
                className="w-full h-12 bg-primary text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
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
    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Label
          htmlFor="password"
          className="text-base font-medium text-foreground"
        >
          Nova senha
        </Label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="h-12 border-input bg-background pl-10 pr-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
            placeholder="Digite sua nova senha"
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
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="confirmPassword"
          className="text-base font-medium text-foreground"
        >
          Confirmar nova senha
        </Label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="h-12 border-input bg-background pl-10 pr-10 text-base text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-input/50 dark:bg-background/80 dark:focus:border-primary dark:focus:ring-primary/30"
            placeholder="Confirme sua nova senha"
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">Sua senha deve conter:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Pelo menos 8 caracteres</li>
          <li>Uma letra minúscula</li>
          <li>Uma letra maiúscula</li>
          <li>Um número</li>
          <li>Um caractere especial (@$!%*?&)</li>
        </ul>
      </div>

      <Button
        type="submit"
        className="h-12 w-full bg-primary text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
        disabled={isSubmitting || !token}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
}
