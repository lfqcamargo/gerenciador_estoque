// "use client";

// import type React from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState } from "react";
// import type { Funcionario } from "./funcionarios-content";

// interface AddFuncionarioDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAdd: (funcionario: Omit<Funcionario, "id">) => void;
// }

// export function AddFuncionarioDialog({
//   open,
//   onOpenChange,
//   onAdd,
// }: AddFuncionarioDialogProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     nome: "",
//     email: "",
//     cargo: "",
//     departamento: "",
//     telefone: "",
//     dataContratacao: new Date().toISOString().split("T")[0],
//     status: "ativo",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validação básica
//     if (
//       !formData.nome ||
//       !formData.email ||
//       !formData.cargo ||
//       !formData.departamento
//     ) {
//       // toast({
//       //   title: "Campos obrigatórios",
//       //   description: "Preencha todos os campos obrigatórios.",
//       //   variant: "destructive",
//       // });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Simulação de chamada à API
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       onAdd(formData);

//       toast({
//         title: "Funcionário adicionado",
//         description: "O funcionário foi adicionado com sucesso.",
//       });

//       // Resetar formulário
//       setFormData({
//         nome: "",
//         email: "",
//         cargo: "",
//         departamento: "",
//         telefone: "",
//         dataContratacao: new Date().toISOString().split("T")[0],
//         status: "ativo",
//       });
//     } catch (error) {
//       toast({
//         title: "Erro ao adicionar",
//         description: "Ocorreu um erro ao adicionar o funcionário.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Adicionar Funcionário</DialogTitle>
//             <DialogDescription>
//               Preencha os dados do novo funcionário.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-1 gap-2">
//               <Label htmlFor="nome">Nome Completo*</Label>
//               <Input
//                 id="nome"
//                 name="nome"
//                 value={formData.nome}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-1 gap-2">
//               <Label htmlFor="email">Email*</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="cargo">Cargo*</Label>
//                 <Input
//                   id="cargo"
//                   name="cargo"
//                   value={formData.cargo}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="departamento">Departamento*</Label>
//                 <Input
//                   id="departamento"
//                   name="departamento"
//                   value={formData.departamento}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="telefone">Telefone</Label>
//                 <Input
//                   id="telefone"
//                   name="telefone"
//                   value={formData.telefone}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="dataContratacao">Data de Contratação</Label>
//                 <Input
//                   id="dataContratacao"
//                   name="dataContratacao"
//                   type="date"
//                   value={formData.dataContratacao}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value) => handleSelectChange("status", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Selecione o status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ativo">Ativo</SelectItem>
//                   <SelectItem value="inativo">Inativo</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancelar
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Adicionando..." : "Adicionar"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
