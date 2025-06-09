"use client";

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
import {
  editCompanySchema,
  type EditCompanyFormData,
} from "../lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCNPJ } from "@/utils/validate-cnpj";
import { editCompanyAction } from "../actions/edit-company-action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyPhotoUpload } from "./company-photo-upload";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditCompanyProps {
  cnpj: string;
  name: string;
  createdAt: string;
  lealName: string;
  photoId: string;
  urlPhoto: string;
}

export function EditCompany({ company }: { company: EditCompanyProps }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditCompanyFormData>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      name: company.name,
      cnpj: formatCNPJ(company.cnpj),
      lealName: company.lealName,
    },
  });

  function handleCancel() {
    router.push("/dashboard");
  }

  async function handleSave(data: EditCompanyFormData) {
    setError(null);
    try {
      data.photo = photoFile;
      const result = await editCompanyAction(data);

      if (result.success) {
        router.refresh();
        // toast.success("Empresa atualizada com sucesso");
        router.push("/company");
      } else {
        setError(result.message || "Erro interno do servidor");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao salvar as informações. Tente novamente.");
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Informações básicas da sua empresa</CardDescription>
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
  );
}
