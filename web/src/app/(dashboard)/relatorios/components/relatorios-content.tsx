"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Package,
  AlertTriangle,
} from "lucide-react";
import { EstoqueAtualChart } from "./estoque-atual-chart";
import { MovimentacoesChart } from "./movimentacoes-chart";
import { ConsumoChart } from "./consumo-chart";
import { RelatoriosCards } from "./relatorios-cards";

export function RelatoriosContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e insights sobre seu estoque
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatórios
        </Button>
      </div>

      <RelatoriosCards />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Estoque Atual por Grupo
            </CardTitle>
            <CardDescription>
              Distribuição do estoque por categoria de materiais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EstoqueAtualChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Movimentações Mensais
            </CardTitle>
            <CardDescription>
              Entradas e saídas dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MovimentacoesChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise de Consumo
          </CardTitle>
          <CardDescription>
            Materiais mais consumidos nos últimos 3 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsumoChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatório de Estoque
            </CardTitle>
            <CardDescription>
              Posição atual de todos os materiais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Relatório completo com posição atual, valores e status de todos
                os materiais cadastrados.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Relatório de Movimentações
            </CardTitle>
            <CardDescription>
              Histórico detalhado de movimentações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Relatório com todas as movimentações realizadas em um período
                específico.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Relatório de Alertas
            </CardTitle>
            <CardDescription>
              Materiais com estoque baixo ou zerado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Lista de materiais que precisam de reposição urgente ou atenção
                especial.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
