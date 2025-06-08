// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Edit, MoreHorizontal, Trash } from "lucide-react";
// import type { Funcionario } from "./funcionarios-content";

// interface FuncionariosTableProps {
//   funcionarios: Funcionario[];
//   onEdit: (funcionario: Funcionario) => void;
//   onDelete: (funcionario: Funcionario) => void;
// }

// export function FuncionariosTable({
//   funcionarios,
//   onEdit,
//   onDelete,
// }: FuncionariosTableProps) {
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("pt-BR").format(date);
//   };

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Nome</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead className="hidden md:table-cell">Cargo</TableHead>
//             <TableHead className="hidden lg:table-cell">Departamento</TableHead>
//             <TableHead className="hidden lg:table-cell">
//               Data Contratação
//             </TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead className="w-[80px]">Ações</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {funcionarios.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={7} className="h-24 text-center">
//                 Nenhum funcionário encontrado.
//               </TableCell>
//             </TableRow>
//           ) : (
//             funcionarios.map((funcionario) => (
//               <TableRow key={funcionario.id}>
//                 <TableCell className="font-medium">
//                   {funcionario.nome}
//                 </TableCell>
//                 <TableCell>{funcionario.email}</TableCell>
//                 <TableCell className="hidden md:table-cell">
//                   {funcionario.cargo}
//                 </TableCell>
//                 <TableCell className="hidden lg:table-cell">
//                   {funcionario.departamento}
//                 </TableCell>
//                 <TableCell className="hidden lg:table-cell">
//                   {formatDate(funcionario.dataContratacao)}
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       funcionario.status === "ativo" ? "default" : "secondary"
//                     }
//                   >
//                     {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" className="h-8 w-8 p-0">
//                         <span className="sr-only">Abrir menu</span>
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Ações</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={() => onEdit(funcionario)}>
//                         <Edit className="mr-2 h-4 w-4" />
//                         Editar
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={() => onDelete(funcionario)}
//                         className="text-destructive focus:text-destructive"
//                       >
//                         <Trash className="mr-2 h-4 w-4" />
//                         Excluir
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
