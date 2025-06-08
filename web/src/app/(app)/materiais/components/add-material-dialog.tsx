"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddMaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMaterialDialog({ open, onOpenChange }: AddMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
          <DialogDescription>Cadastre um novo material no sistema de estoque</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" placeholder="Ex: PAR001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grupo">Grupo</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixacao">Fixação</SelectItem>
                    <SelectItem value="chapas">Chapas</SelectItem>
                    <SelectItem value="tintas">Tintas</SelectItem>
                    <SelectItem value="eletricos">Elétricos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Material</Label>
              <Input id="nome" placeholder="Ex: Parafuso M6x20" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" placeholder="Descrição detalhada do material..." rows={3} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">UN - Unidade</SelectItem>
                    <SelectItem value="KG">KG - Quilograma</SelectItem>
                    <SelectItem value="M">M - Metro</SelectItem>
                    <SelectItem value="M2">M² - Metro Quadrado</SelectItem>
                    <SelectItem value="L">L - Litro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimo">Estoque Mínimo</Label>
                <Input id="minimo" type="number" placeholder="0" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Unitário</Label>
                <Input id="valor" type="number" step="0.01" placeholder="0,00" min="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localPadrao">Local Padrão de Estoque</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GAL01-A-C01-P01-01">
                    GAL01-A-C01-P01-01 - Galpão Principal > Área A > Corredor 01 > Prateleira 01 > Posição 01
                  </SelectItem>
                  <SelectItem value="GAL01-A-C01-P01-02">
                    GAL01-A-C01-P01-02 - Galpão Principal > Área A > Corredor 01 > Prateleira 01 > Posição 02
                  </SelectItem>
                  <SelectItem value="GAL01-B-C01-P01-01">
                    GAL01-B-C01-P01-01 - Galpão Principal > Área B > Corredor 01 > Prateleira 01 > Posição 01
                  </SelectItem>
                  <SelectItem value="DEP01-A-C01-P01-01">
                    DEP01-A-C01-P01-01 - Depósito Secundário > Área Única > Corredor 01 > Prateleira 01 > Posição 01
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
