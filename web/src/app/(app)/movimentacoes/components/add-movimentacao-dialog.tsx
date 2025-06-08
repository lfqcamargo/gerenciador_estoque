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

interface AddMovimentacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMovimentacaoDialog({
  open,
  onOpenChange,
}: AddMovimentacaoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tipo, setTipo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
          <DialogDescription>
            Registre uma nova movimentação de estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Movimentação</Label>
                <Select value={tipo} onValueChange={setTipo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                    <SelectItem value="ajuste">Ajuste</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data/Hora</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAR001">
                    PAR001 - Parafuso M6x20
                  </SelectItem>
                  <SelectItem value="CHA001">
                    CHA001 - Chapa de Aço 2mm
                  </SelectItem>
                  <SelectItem value="TIN001">
                    TIN001 - Tinta Branca 1L
                  </SelectItem>
                  <SelectItem value="CAB001">
                    CAB001 - Cabo Elétrico 2.5mm
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipo === "transferencia" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localOrigem">Local de Origem</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Local atual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAL01-A-C01-P01-01">
                        GAL01-A-C01-P01-01
                      </SelectItem>
                      <SelectItem value="GAL01-A-C01-P01-02">
                        GAL01-A-C01-P01-02
                      </SelectItem>
                      <SelectItem value="GAL01-B-C01-P01-01">
                        GAL01-B-C01-P01-01
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localDestino">Local de Destino</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Novo local" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAL01-A-C01-P01-01">
                        GAL01-A-C01-P01-01
                      </SelectItem>
                      <SelectItem value="GAL01-A-C01-P01-02">
                        GAL01-A-C01-P01-02
                      </SelectItem>
                      <SelectItem value="DEP01-A-C01-P01-01">
                        DEP01-A-C01-P01-01
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GAL01-A-C01-P01-01">
                      GAL01-A-C01-P01-01 - Galpão Principal &gt; Área A &gt;
                      Corredor 01 &gt; Prateleira 01 &gt; Posição 01
                    </SelectItem>
                    <SelectItem value="GAL01-A-C01-P01-02">
                      GAL01-A-C01-P01-02 - Galpão Principal &gt; Área A &gt;
                      Corredor 01 &gt; Prateleira 01 &gt; Posição 02
                    </SelectItem>
                    <SelectItem value="GAL01-B-C01-P01-01">
                      GAL01-B-C01-P01-01 - Galpão Principal &gt; Área B &gt;
                      Corredor 01 &gt; Prateleira 01 &gt; Posição 01
                    </SelectItem>
                    <SelectItem value="DEP01-A-C01-P01-01">
                      DEP01-A-C01-P01-01 - Depósito Secundário &gt; Área Única
                      &gt; Corredor 01 &gt; Prateleira 01 &gt; Posição 01
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorUnitario">Valor Unitário</Label>
                <Input
                  id="valorUnitario"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">Documento</Label>
                <Input id="documento" placeholder="Ex: NF-001234" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Observações sobre a movimentação..."
                rows={3}
              />
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
              {isLoading ? "Salvando..." : "Salvar Movimentação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
