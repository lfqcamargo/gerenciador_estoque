// "use client";

// import type React from "react";

// import { Button } from "@/components/ui/button";
// import { Upload } from "lucide-react";
// import { useState } from "react";

// interface CompanyPhotoUploadProps {
//   photo: string | null;
//   name: string;
//   onPhotoChange: (photo: string | null) => void;
// }

// export function CompanyPhotoUpload({
//   photo,
//   name,
//   onPhotoChange,
// }: CompanyPhotoUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("");

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validar tipo de arquivo
//     if (!file.type.startsWith("image/")) {
//       // toast({
//       //   title: "Tipo de arquivo inválido",
//       //   description: "Por favor, selecione uma imagem.",
//       //   variant: "destructive",
//       // });
//       return;
//     }

//     // Validar tamanho (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       // toast({
//       //   title: "Arquivo muito grande",
//       //   description: "O tamanho máximo permitido é 5MB.",
//       //   variant: "destructive",
//       // });
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Simulação de upload - substituir por upload real
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Converter para base64 para preview (em produção, usar URL da API)
//       const reader = new FileReader();
//       reader.onload = () => {
//         onPhotoChange(reader.result as string);
//         setIsUploading(false);

//         // toast({
//         //   title: "Logo atualizado",
//         //   description: "O logo da empresa foi atualizado com sucesso.",
//         // });
//       };
//       reader.readAsDataURL(file);
//     } catch (error) {
//       setIsUploading(false);
//       // toast({
//       //   title: "Erro ao fazer upload",
//       //   description: "Ocorreu um erro ao fazer upload da imagem.",
//       //   variant: "destructive",
//       // });
//     }
//   };

//   const handleRemovePhoto = () => {
//     onPhotoChange(null);
//     // toast({
//     //   title: "Logo removido",
//     //   description: "O logo da empresa foi removido.",
//     // });
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div className="relative">
//         {photo ? (
//           <div className="h-40 w-40 rounded-full overflow-hidden border">
//             <img
//               src={photo || "/placeholder.svg"}
//               alt={`Logo da ${name}`}
//               className="h-full w-full object-cover"
//             />
//           </div>
//         ) : (
//           <div className="h-40 w-40 rounded-full bg-primary/10 flex items-center justify-center border">
//             <span className="text-4xl font-medium text-primary">
//               {initials}
//             </span>
//           </div>
//         )}

//         <label
//           htmlFor="photo-upload"
//           className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
//         >
//           <Upload className="h-4 w-4" />
//           <input
//             type="file"
//             id="photo-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileChange}
//             disabled={isUploading}
//           />
//         </label>
//       </div>

//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleRemovePhoto}
//           disabled={!photo || isUploading}
//         >
//           Remover
//         </Button>
//         <Button size="sm" disabled={isUploading} asChild>
//           <label htmlFor="photo-upload-btn" className="cursor-pointer">
//             {isUploading ? "Enviando..." : "Alterar"}
//             <input
//               type="file"
//               id="photo-upload-btn"
//               className="hidden"
//               accept="image/*"
//               onChange={handleFileChange}
//               disabled={isUploading}
//             />
//           </label>
//         </Button>
//       </div>
//     </div>
//   );
// }
