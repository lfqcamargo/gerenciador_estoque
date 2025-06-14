import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Camera, Save, Lock, User } from "lucide-react";
import { useState, useRef } from "react";

// Dados de exemplo baseados no modelo User
const userData = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@empresa.com",
  role: "EMPLOYEE", // UserRole
  active: true,
  photoId: null, // String? para referência da foto
  createdAt: "2022-01-15T10:00:00Z",
  lastLogin: "2024-01-15T08:30:00Z",
  companyId: "company-1",
};

export function ProfilePage() {
  const [formData, setFormData] = useState({
    name: userData.name,
    photoId: userData.photoId,
  });
  const [passwordData, setPasswordData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        // Em produção, aqui você faria upload e receberia o photoId
        setFormData((prev) => ({ ...prev, photoId: "new-photo-id" }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, photoId: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Perfil atualizado:", formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    setIsChangingPassword(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Senha alterada");
      setPasswordData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } finally {
      setIsChangingPassword(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getRoleLabel(role: string) {
    const roles = {
      ADMIN: "Administrador",
      MANAGER: "Gerente",
      EMPLOYEE: "Funcionário",
    };
    return roles[role as keyof typeof roles] || role;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editar Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>
              Atualize seu nome e foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Upload de Foto */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={previewUrl || undefined}
                      alt={formData.name}
                    />
                    <AvatarFallback className="text-lg">
                      {formData.name.split(" ")[0].charAt(0)}
                      {formData.name.split(" ")[1].charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={handlePhotoClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePhotoClick}
                  >
                    Alterar Foto
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemovePhoto}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Campo Nome */}
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Informações</CardTitle>
            <CardDescription>Dados do seu perfil no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Função
                </label>
                <p className="text-sm font-medium">
                  {getRoleLabel(userData.role)}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={userData.active ? "default" : "secondary"}>
                  {userData.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Criado em
                </label>
                <p className="text-sm">{formatDate(userData.createdAt)}</p>
              </div>
            </div>

            {userData.lastLogin && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Último Login
                </label>
                <p className="text-sm">{formatDate(userData.lastLogin)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Atualize sua senha de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 max-w-md"
            >
              <div>
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <Input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  value={passwordData.senhaAtual}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  value={passwordData.novaSenha}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  value={passwordData.confirmarSenha}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
