// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus, Search } from "lucide-react";
// import { useState } from "react";
// import { FuncionariosTable } from "./funcionarios-table";
// import { AddFuncionarioDialog } from "./add-funcionario-dialog";
// import { EditFuncionarioDialog } from "./edit-funcionario-dialog";
// import { DeleteFuncionarioDialog } from "./delete-funcionario-dialog";

// // Dados de exemplo - substituir por chamada à API
// const funcionariosData = [
//   {
//     id: "1",
//     nome: "João Silva",
//     email: "joao.silva@empresa.com",
//     cargo: "Gerente de Estoque",
//     departamento: "Operações",
//     telefone: "(11) 98765-4321",
//     dataContratacao: "2022-03-15",
//     status: "ativo",
//   },
//   {
//     id: "2",
//     nome: "Maria Oliveira",
//     email: "maria.oliveira@empresa.com",
//     cargo: "Analista de Logística",
//     departamento: "Operações",
//     telefone: "(11) 91234-5678",
//     dataContratacao: "2022-05-20",
//     status: "ativo",
//   },
//   {
//     id: "3",
//     nome: "Pedro Santos",
//     email: "pedro.santos@empresa.com",
//     cargo: "Assistente Administrativo",
//     departamento: "Administrativo",
//     telefone: "(11) 99876-5432",
//     dataContratacao: "2023-01-10",
//     status: "ativo",
//   },
//   {
//     id: "4",
//     nome: "Ana Costa",
//     email: "ana.costa@empresa.com",
//     cargo: "Coordenadora de Compras",
//     departamento: "Compras",
//     telefone: "(11) 95555-4444",
//     dataContratacao: "2021-11-05",
//     status: "ativo",
//   },
//   {
//     id: "5",
//     nome: "Carlos Ferreira",
//     email: "carlos.ferreira@empresa.com",
//     cargo: "Auxiliar de Estoque",
//     departamento: "Operações",
//     telefone: "(11) 94444-3333",
//     dataContratacao: "2023-02-15",
//     status: "inativo",
//   },
// ];

// export type Funcionario = (typeof funcionariosData)[0];

// export function FuncionariosContent() {
//   const [funcionarios, setFuncionarios] = useState(funcionariosData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedFuncionario, setSelectedFuncionario] =
//     useState<Funcionario | null>(null);

//   const filteredFuncionarios = funcionarios.filter(
//     (funcionario) =>
//       funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       funcionario.departamento.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddFuncionario = (funcionario: Omit<Funcionario, "id">) => {
//     const newFuncionario = {
//       ...funcionario,
//       id: `${funcionarios.length + 1}`,
//     };
//     setFuncionarios([...funcionarios, newFuncionario]);
//     setIsAddDialogOpen(false);
//   };

//   const handleEditFuncionario = (funcionario: Funcionario) => {
//     setFuncionarios(
//       funcionarios.map((f) => (f.id === funcionario.id ? funcionario : f))
//     );
//     setIsEditDialogOpen(false);
//     setSelectedFuncionario(null);
//   };

//   const handleDeleteFuncionario = (id: string) => {
//     setFuncionarios(funcionarios.filter((f) => f.id !== id));
//     setIsDeleteDialogOpen(false);
//     setSelectedFuncionario(null);
//   };

//   const openEditDialog = (funcionario: Funcionario) => {
//     setSelectedFuncionario(funcionario);
//     setIsEditDialogOpen(true);
//   };

//   const openDeleteDialog = (funcionario: Funcionario) => {
//     setSelectedFuncionario(funcionario);
//     setIsDeleteDialogOpen(true);
//   };

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
//           <p className="text-muted-foreground">
//             Gerencie os funcionários da sua empresa
//           </p>
//         </div>
//         <Button onClick={() => setIsAddDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Novo Funcionário
//         </Button>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar funcionários..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <FuncionariosTable
//         funcionarios={filteredFuncionarios}
//         onEdit={openEditDialog}
//         onDelete={openDeleteDialog}
//       />

//       <AddFuncionarioDialog
//         open={isAddDialogOpen}
//         onOpenChange={setIsAddDialogOpen}
//         onAdd={handleAddFuncionario}
//       />

//       {selectedFuncionario && (
//         <>
//           <EditFuncionarioDialog
//             open={isEditDialogOpen}
//             onOpenChange={setIsEditDialogOpen}
//             funcionario={selectedFuncionario}
//             onEdit={handleEditFuncionario}
//           />

//           <DeleteFuncionarioDialog
//             open={isDeleteDialogOpen}
//             onOpenChange={setIsDeleteDialogOpen}
//             funcionario={selectedFuncionario}
//             onDelete={handleDeleteFuncionario}
//           />
//         </>
//       )}
//     </div>
//   );
// }
