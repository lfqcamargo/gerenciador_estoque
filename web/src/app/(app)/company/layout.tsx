"use server";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import Link from "next/link";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <Tabs defaultValue="informacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="informacoes">
            <Link className="flex items-center" href="/company">
              <Building2 className="h-4 w-4 mr-2" />
              Informações
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="funcionarios">
            <Link className="flex items-center" href="/company/employee">
              <Users className="h-4 w-4 mr-2" />
              Funcionários
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}
