"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "./overview";
import { RecentMovements } from "./recent-movements";
import { StatsCards } from "./stats-cards";

export function DashboardContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Movimentações do Mês</CardTitle>
            <CardDescription>
              Entradas e saídas de materiais nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
            <CardDescription>
              Últimas 5 movimentações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentMovements />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
