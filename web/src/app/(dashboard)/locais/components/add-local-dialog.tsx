"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface AddLocalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLocalDialog({ open, onOpenChange }: AddLocalDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [ativo, setAtivo] = useState(true);
  const [tipo, setTipo] = useState("");
  const [localPai, setLocalPai] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    onOpenChange(false);
  };

  const getTipoOptions = () => {
    return [
      { value: "local", label: "Local Principal" },
      { value: "sub-local", label: "Sub-local" },
      { value: "corredor", label: "Corredor" },
      { value: "prateleira", label: "Prateleira" },
      { value: "posicao", label: "Posição" },
    ];
  };

  const getLocalPaiOptions = () => {
    // Opções baseadas no tipo selecionado
    switch (tipo) {
      case "sub-local":
        return [
          { value: "GAL01", label: "GAL01 - Galpão Principal" },
          { value: "DEP01", label: "DEP01 - Depósito Secundário" },
        ];
      case "corredor":
        return [
          { value: "GAL01-A", label: "GAL01-A - Área A - Materiais Pesados" },
          { value: "GAL01-B", label: "GAL01-B - Área B - Materiais Leves" },
          { value: "DEP01-A", label: "DEP01-A - Área Única" },
        ];
      case "prateleira":
        return [
          { value: "GAL01-A-C01", label: "GAL01-A-C01 - Corredor 01" },
          { value: "GAL01-A-C02", label: "GAL01-A-C02 - Corredor 02" },
          { value: "GAL01-B-C01", label: "GAL01-B-C01 - Corredor 01" },
        ];
      case "posicao":
        return [
          {
            value: "GAL01-A-C01-P01",
            label: "GAL01-A-C01-P01 - Prateleira 01",
          },
          {
            value: "GAL01-A-C01-P02",
            label: "GAL01-A-C01-P02 - Prateleira 02",
          },
          {
            value: "GAL01-B-C01-P01",
            label: "GAL01-B-C01-P01 - Prateleira 01",
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Local de Estoque</DialogTitle>
          <DialogDescription>
            Cadastre um novo local na hierarquia de estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Local</Label>
                <Select value={tipo} onValueChange={setTipo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTipoOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
                <Label htmlFor="ativo">Local ativo</Label>
              </div>
            </div>

            {tipo && tipo !== "local" && (
              <div className="space-y-2">
                <Label htmlFor="localPai">Local Pai</Label>
                <Select value={localPai} onValueChange={setLocalPai} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local pai" />
                  </SelectTrigger>
                  <SelectContent>
                    {getLocalPaiOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  placeholder={
                    tipo === "local"
                      ? "Ex: GAL02"
                      : "Será gerado automaticamente"
                  }
                  disabled={tipo !== "local"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Local</Label>
                <Input id="nome" placeholder="Ex: Galpão Norte" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição detalhada do local..."
                rows={3}
              />
            </div>

            {tipo === "posicao" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade Máxima</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    placeholder="0"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso Máximo (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume Máximo (m³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Hierarquia de locais:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <strong>Local:</strong> Galpão, depósito ou área principal
                </li>
                <li>
                  <strong>Sub-local:</strong> Área específica dentro do local
                </li>
                <li>
                  <strong>Corredor:</strong> Corredor dentro do sub-local
                </li>
                <li>
                  <strong>Prateleira:</strong> Prateleira dentro do corredor
                </li>
                <li>
                  <strong>Posição:</strong> Posição específica na prateleira
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Local"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
