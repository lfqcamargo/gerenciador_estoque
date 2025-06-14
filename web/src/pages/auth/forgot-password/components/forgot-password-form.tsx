import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../lib/validations";
import { forgotPasswordAction } from "../actions/forgot-password-action";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(data: ForgotPasswordFormData) {
    setError(null);

    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(data);

        if (result.success) {
          navigate(
            `/auth/sign-in?email=${encodeURIComponent(
              data.email
            )}&from=forgot-password`
          );
        } else {
          setError(result.message || "Erro ao enviar email de recuperação");
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        setError("Erro inesperado. Tente novamente.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            placeholder="Digite seu email cadastrado"
            disabled={isPending}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Enviaremos um link de recuperação para o email informado. Verifique
          também sua caixa de spam.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="h-12 w-full bg-primary text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar instruções"
          )}
        </Button>

        <Link to={"/auth/sign-in"}>
          <Button variant="ghost" className="w-full h-12">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </Link>
      </div>
    </form>
  );
}
