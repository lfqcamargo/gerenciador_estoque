// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { AlertTriangle } from "lucide-react";
// import { useState } from "react";
// import type { Funcionario } from "./funcionarios-content";

// interface DeleteFuncionarioDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   funcionario: Funcionario;
//   onDelete: (id: string) => void;
// }

// export function DeleteFuncionarioDialog({
//   open,
//   onOpenChange,
//   funcionario,
//   onDelete,
// }: DeleteFuncionarioDialogProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleDelete = async () => {
//     setIsLoading(true);

//     try {
//       // Simulação de chamada à API
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       onDelete(funcionario.id);

//       // toast({
//       //   title: "Funcionário excluído",
//       //   description: "O funcionário foi excluído com sucesso.",
//       // });
//     } catch (error) {
//       // toast({
//       //   title: "Erro ao excluir",
//       //   description: "Ocorreu um erro ao excluir o funcionário.",
//       //   variant: "destructive",
//       // });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <AlertTriangle className="h-5 w-5 text-destructive" />
//             Excluir Funcionário
//           </DialogTitle>
//           <DialogDescription>
//             Esta ação não pode ser desfeita. Isso excluirá permanentemente o
//             funcionário <strong>{funcionario.nome}</strong> do sistema.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4">
//           <p className="text-sm text-muted-foreground">
//             Tem certeza que deseja excluir este funcionário?
//           </p>
//         </div>
//         <DialogFooter>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//           >
//             Cancelar
//           </Button>
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={isLoading}
//           >
//             {isLoading ? "Excluindo..." : "Excluir"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
