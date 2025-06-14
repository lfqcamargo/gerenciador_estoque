import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Link } from "react-router-dom";

const signInSchema = z.object({
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

export type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const emailWatch = watch("email");
  const passwordWatch = watch("password");

  const activeButton = Boolean(emailWatch && passwordWatch && !isSubmitting);

  async function handleSignIn(data: SignInFormData) {
    try {
      console.log(data);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit(handleSignIn)}>
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
            to={"/auth/forgot-password"}
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
