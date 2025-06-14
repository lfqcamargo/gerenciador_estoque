import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import {
  getProfileCompany,
  type GetProfileCompanyResponse,
} from "@/api/get-profile-company";
import {
  getProfileUser,
  type GetProfileUserResponse,
} from "@/api/get-profile-user";

const navData = {
  user: {
    name: "Lucas Fernando",
    email: "lucas@stockmanager.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "Home",
      isActive: true,
    },
    {
      title: "Estoque",
      url: "#",
      icon: "Box",
      items: [
        { title: "Grupos de Material", url: "/grupos-material" },
        { title: "Materiais", url: "/materiais" },
        { title: "Locais de Estoque", url: "/locais" },
        { title: "Movimentações", url: "/movimentacoes" },
      ],
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: "BarChart3",
      items: [
        { title: "Estoque Atual", url: "/relatorios/estoque-atual" },
        { title: "Movimentações", url: "/relatorios/movimentacoes" },
        { title: "Análise de Consumo", url: "/relatorios/consumo" },
      ],
    },
    {
      title: "Administração",
      url: "#",
      icon: "Settings",
      items: [{ title: "Configurações", url: "/configuracoes" }],
    },
  ],
};

export function SidebarDataProvider() {
  const [profileCompany, setProfileCompany] =
    useState<GetProfileCompanyResponse | null>(null);
  const [profileUser, setProfileUser] = useState<GetProfileUserResponse | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [company, user] = await Promise.all([
          getProfileCompany(),
          getProfileUser(),
        ]);
        setProfileCompany(company);
        setProfileUser(user);
      } catch (error) {
        console.error("Erro ao buscar dados do sidebar:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppSidebar
      profileCompany={profileCompany}
      profileUser={profileUser}
      navData={navData}
    />
  );
}
