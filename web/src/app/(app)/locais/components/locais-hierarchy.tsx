"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Building,
  MapPin,
  Navigation,
  Layers,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dados mockados com hierarquia completa
const locaisData = [
  {
    id: "1",
    codigo: "GAL01",
    nome: "Galpão Principal",
    tipo: "local",
    materiais: 0,
    subLocais: [
      {
        id: "1-1",
        codigo: "GAL01-A",
        nome: "Área A - Materiais Pesados",
        tipo: "sub-local",
        materiais: 0,
        corredores: [
          {
            id: "1-1-1",
            codigo: "GAL01-A-C01",
            nome: "Corredor 01",
            tipo: "corredor",
            materiais: 0,
            prateleiras: [
              {
                id: "1-1-1-1",
                codigo: "GAL01-A-C01-P01",
                nome: "Prateleira 01",
                tipo: "prateleira",
                materiais: 0,
                posicoes: [
                  {
                    id: "1-1-1-1-1",
                    codigo: "GAL01-A-C01-P01-01",
                    nome: "Posição 01",
                    tipo: "posicao",
                    materiais: 5,
                  },
                  {
                    id: "1-1-1-1-2",
                    codigo: "GAL01-A-C01-P01-02",
                    nome: "Posição 02",
                    tipo: "posicao",
                    materiais: 3,
                  },
                  {
                    id: "1-1-1-1-3",
                    codigo: "GAL01-A-C01-P01-03",
                    nome: "Posição 03",
                    tipo: "posicao",
                    materiais: 0,
                  },
                ],
              },
              {
                id: "1-1-1-2",
                codigo: "GAL01-A-C01-P02",
                nome: "Prateleira 02",
                tipo: "prateleira",
                materiais: 0,
                posicoes: [
                  {
                    id: "1-1-1-2-1",
                    codigo: "GAL01-A-C01-P02-01",
                    nome: "Posição 01",
                    tipo: "posicao",
                    materiais: 2,
                  },
                  {
                    id: "1-1-1-2-2",
                    codigo: "GAL01-A-C01-P02-02",
                    nome: "Posição 02",
                    tipo: "posicao",
                    materiais: 4,
                  },
                ],
              },
            ],
          },
          {
            id: "1-1-2",
            codigo: "GAL01-A-C02",
            nome: "Corredor 02",
            tipo: "corredor",
            materiais: 0,
            prateleiras: [
              {
                id: "1-1-2-1",
                codigo: "GAL01-A-C02-P01",
                nome: "Prateleira 01",
                tipo: "prateleira",
                materiais: 0,
                posicoes: [
                  {
                    id: "1-1-2-1-1",
                    codigo: "GAL01-A-C02-P01-01",
                    nome: "Posição 01",
                    tipo: "posicao",
                    materiais: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        codigo: "GAL01-B",
        nome: "Área B - Materiais Leves",
        tipo: "sub-local",
        materiais: 0,
        corredores: [
          {
            id: "1-2-1",
            codigo: "GAL01-B-C01",
            nome: "Corredor 01",
            tipo: "corredor",
            materiais: 0,
            prateleiras: [
              {
                id: "1-2-1-1",
                codigo: "GAL01-B-C01-P01",
                nome: "Prateleira 01",
                tipo: "prateleira",
                materiais: 0,
                posicoes: [
                  {
                    id: "1-2-1-1-1",
                    codigo: "GAL01-B-C01-P01-01",
                    nome: "Posição 01",
                    tipo: "posicao",
                    materiais: 8,
                  },
                  {
                    id: "1-2-1-1-2",
                    codigo: "GAL01-B-C01-P01-02",
                    nome: "Posição 02",
                    tipo: "posicao",
                    materiais: 6,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    codigo: "DEP01",
    nome: "Depósito Secundário",
    tipo: "local",
    materiais: 0,
    subLocais: [
      {
        id: "2-1",
        codigo: "DEP01-A",
        nome: "Área Única",
        tipo: "sub-local",
        materiais: 0,
        corredores: [
          {
            id: "2-1-1",
            codigo: "DEP01-A-C01",
            nome: "Corredor 01",
            tipo: "corredor",
            materiais: 0,
            prateleiras: [
              {
                id: "2-1-1-1",
                codigo: "DEP01-A-C01-P01",
                nome: "Prateleira 01",
                tipo: "prateleira",
                materiais: 0,
                posicoes: [
                  {
                    id: "2-1-1-1-1",
                    codigo: "DEP01-A-C01-P01-01",
                    nome: "Posição 01",
                    tipo: "posicao",
                    materiais: 12,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

interface LocaisHierarchyProps {
  searchTerm: string;
}

export function LocaisHierarchy({ searchTerm }: LocaisHierarchyProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["1", "1-1", "1-1-1", "1-1-1-1"])
  );

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "local":
        return Building;
      case "sub-local":
        return MapPin;
      case "corredor":
        return Navigation;
      case "prateleira":
        return Layers;
      case "posicao":
        return Package;
      default:
        return Package;
    }
  };

  const getIndentLevel = (tipo: string) => {
    switch (tipo) {
      case "local":
        return 0;
      case "sub-local":
        return 1;
      case "corredor":
        return 2;
      case "prateleira":
        return 3;
      case "posicao":
        return 4;
      default:
        return 0;
    }
  };

  const renderItem = (item: any, level = 0) => {
    const Icon = getIcon(item.tipo);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren =
      item.subLocais?.length > 0 ||
      item.corredores?.length > 0 ||
      item.prateleiras?.length > 0 ||
      item.posicoes?.length > 0;

    // Filtro de busca
    const matchesSearch =
      !searchTerm ||
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch && !hasChildren) return null;

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg cursor-pointer",
            `ml-${level * 4}`
          )}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => hasChildren && toggleExpanded(item.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}

          <Icon className="h-4 w-4 text-muted-foreground" />

          <div className="flex-1 flex items-center justify-between">
            <div>
              <span className="font-medium">{item.nome}</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({item.codigo})
              </span>
            </div>

            {item.materiais > 0 && (
              <Badge variant="secondary" className="ml-2">
                {item.materiais} materiais
              </Badge>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {item.subLocais?.map((subLocal: any) =>
              renderItem(subLocal, level + 1)
            )}
            {item.corredores?.map((corredor: any) =>
              renderItem(corredor, level + 1)
            )}
            {item.prateleiras?.map((prateleira: any) =>
              renderItem(prateleira, level + 1)
            )}
            {item.posicoes?.map((posicao: any) =>
              renderItem(posicao, level + 1)
            )}
          </div>
        )}

        {isExpanded &&
          item.subLocais?.map((subLocal: any) => (
            <div key={subLocal.id}>
              {subLocal.corredores?.map((corredor: any) => (
                <div key={corredor.id}>
                  {renderItem(corredor, level + 2)}
                  {expandedItems.has(corredor.id) &&
                    corredor.prateleiras?.map((prateleira: any) => (
                      <div key={prateleira.id}>
                        {renderItem(prateleira, level + 3)}
                        {expandedItems.has(prateleira.id) &&
                          prateleira.posicoes?.map((posicao: any) =>
                            renderItem(posicao, level + 4)
                          )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {locaisData.map((local) => renderItem(local))}
    </div>
  );
}
