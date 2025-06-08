// "use client";

// import type React from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Building2, MapPin, Save, Users } from "lucide-react";
// import { useState } from "react";
// import { CompanyPhotoUpload } from "./company-photo-upload";
// import Link from "next/link";

// // Dados de exemplo - substituir por chamada à API
// const companyData = {
//   id: "1",
//   name: "StockManager Pro",
//   cnpj: "12345678000199",
//   lealName: "StockManager Tecnologia LTDA",
//   photo: null,
//   createdAt: new Date().toISOString(),
// };

// export function CompanyEditContent() {
//   const [company, setCompany] = useState(companyData);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCompany((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     setIsLoading(true);

//     // Simulação de chamada à API
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // toast({
//     //   title: "Empresa atualizada",
//     //   description: "As informações da empresa foram atualizadas com sucesso.",
//     // });

//     setIsLoading(false);
//   };

//   const formatCnpj = (value: string) => {
//     return value
//       .replace(/\D/g, "")
//       .replace(/^(\d{2})(\d)/, "$1.$2")
//       .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
//       .replace(/\.(\d{3})(\d)/, ".$1/$2")
//       .replace(/(\d{4})(\d)/, "$1-$2")
//       .substring(0, 18);
//   };

//   const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatCnpj(e.target.value);
//     setCompany((prev) => ({ ...prev, cnpj: formattedValue }));
//   };

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Empresa</h1>
//           <p className="text-muted-foreground">
//             Gerencie as informações da sua empresa
//           </p>
//         </div>
//         <Button onClick={handleSave} disabled={isLoading}>
//           {isLoading ? (
//             <>Salvando...</>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Salvar Alterações
//             </>
//           )}
//         </Button>
//       </div>

//       <Tabs defaultValue="informacoes" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="informacoes">
//             <Building2 className="h-4 w-4 mr-2" />
//             Informações
//           </TabsTrigger>
//           <TabsTrigger value="endereco">
//             <MapPin className="h-4 w-4 mr-2" />
//             Endereço
//           </TabsTrigger>
//           <TabsTrigger value="funcionarios">
//             <Users className="h-4 w-4 mr-2" />
//             Funcionários
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="informacoes" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Informações Gerais</CardTitle>
//               <CardDescription>
//                 Informações básicas da sua empresa
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="flex-1 space-y-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="name">Nome Fantasia</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       value={company.name}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="lealName">Razão Social</Label>
//                     <Input
//                       id="lealName"
//                       name="lealName"
//                       value={company.lealName || ""}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="cnpj">CNPJ</Label>
//                     <Input
//                       id="cnpj"
//                       name="cnpj"
//                       value={company.cnpj}
//                       onChange={handleCnpjChange}
//                       maxLength={18}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex-1 flex flex-col items-center justify-start">
//                   <Label className="mb-2">Logo da Empresa</Label>
//                   <CompanyPhotoUpload
//                     photo={company.photo}
//                     name={company.name}
//                     onPhotoChange={(photo) =>
//                       setCompany((prev) => ({ ...prev, photo }))
//                     }
//                   />
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline">Cancelar</Button>
//               <Button onClick={handleSave} disabled={isLoading}>
//                 {isLoading ? "Salvando..." : "Salvar"}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="funcionarios">
//           <Card>
//             <CardHeader>
//               <CardTitle>Funcionários</CardTitle>
//               <CardDescription>
//                 Gerencie os funcionários da sua empresa
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between mb-4">
//                 <p className="text-sm text-muted-foreground">
//                   Acesse a página de funcionários para gerenciar sua equipe.
//                 </p>
//                 <Button asChild>
//                   <Link href="/company/funcionarios">
//                     <Users className="mr-2 h-4 w-4" />
//                     Ver Funcionários
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
