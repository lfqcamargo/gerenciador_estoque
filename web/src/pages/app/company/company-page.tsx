import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { editCompanySchema, type EditCompanyFormData } from "./lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCNPJ } from "@/utils/validate-cnpj";
import { editCompanyAction } from "./actions/edit-company-action";
import { useEffect, useState } from "react";
import { CompanyPhotoUpload } from "./components/company-photo-upload";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getProfileCompany } from "@/api/get-profile-company";
import { getAttachement } from "@/api/get-attachement";

interface Company {
  cnpj: string;
  name: string;
  createdAt: string;
  lealName: string;
  photoId: string;
  urlPhoto: string | null;
}

export function CompanyPage() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EditCompanyFormData>({
    resolver: zodResolver(editCompanySchema),
  });

  // Carregamento de dados inicial
  useEffect(() => {
    async function loadCompany() {
      try {
        const profile = await getProfileCompany();

        const attachement = await getAttachement({
          id: profile.photoId,
        });

        setCompany({
          ...profile,
          urlPhoto: attachement?.url || null,
        });

        reset({
          name: profile.name,
          cnpj: formatCNPJ(profile.cnpj),
          lealName: profile.lealName,
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados da empresa.");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [reset]);

  function handleCancel() {
    navigate("/dashboard");
  }

  async function handleSave(data: EditCompanyFormData) {
    try {
      data.photo = photoFile;
      const result = await editCompanyAction(data, company?.photoId ?? null);

      if (result.success) {
        toast.success("Empresa atualizada com sucesso");
        navigate("/company");
      } else {
        toast.error(result.message || "Erro interno do servidor");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  if (loading || !company) {
    return <p className="p-4">Carregando dados da empresa...</p>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie as informações da sua empresa
          </p>
        </div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Informações básicas da sua empresa
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    {...register("cnpj")}
                    maxLength={18}
                    readOnly
                    disabled
                  />
                  {errors.cnpj && (
                    <p className="text-sm text-destructive">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Fantasia</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lealName">Razão Social</Label>
                  <Input id="lealName" {...register("lealName")} />
                  {errors.lealName && (
                    <p className="text-sm text-destructive">
                      {errors.lealName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-start">
                <Label className="mb-2">Logo da Empresa</Label>
                <CompanyPhotoUpload
                  urlPhoto={company.urlPhoto}
                  name={company.name}
                  onPhotoChange={(file) => setPhotoFile(file)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
