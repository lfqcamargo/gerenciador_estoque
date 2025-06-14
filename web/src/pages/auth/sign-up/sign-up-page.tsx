import { Suspense } from "react";
import { SignUpForm } from "./components/sign-up-form";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function SignUpPage() {
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
          <Suspense fallback={<div>Carregando...</div>}>
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>

      <div className="mt-4 flex w-full max-w-[500px] items-center justify-center space-x-2">
        <span className="text-muted-foreground">Já tem uma conta?</span>
        <Link
          to={"/auth/sign-in"}
          className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/90 font-medium"
        >
          Faça Login
        </Link>
      </div>
    </div>
  );
}
