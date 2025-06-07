"use client";

import type * as React from "react";
import { BarChart3, Box, Home, Settings, Package } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Dados de navegação
const data = {
  user: {
    name: "Lucas Fernando",
    email: "lucas@stockmanager.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "StockManager Pro",
      logo: Package,
      plan: "Empresarial",
    },
    {
      name: "Filial Centro",
      logo: Package,
      plan: "Básico",
    },
    {
      name: "Filial Norte",
      logo: Package,
      plan: "Básico",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Estoque",
      url: "#",
      icon: Box,
      items: [
        {
          title: "Grupos de Material",
          url: "/grupos-material",
        },
        {
          title: "Materiais",
          url: "/materiais",
        },
        {
          title: "Locais de Estoque",
          url: "/locais",
        },
        {
          title: "Movimentações",
          url: "/movimentacoes",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
      items: [
        {
          title: "Estoque Atual",
          url: "/relatorios/estoque-atual",
        },
        {
          title: "Movimentações",
          url: "/relatorios/movimentacoes",
        },
        {
          title: "Análise de Consumo",
          url: "/relatorios/consumo",
        },
      ],
    },
    {
      title: "Administração",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Usuários",
          url: "/usuarios",
        },
        {
          title: "Configurações",
          url: "/configuracoes",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
