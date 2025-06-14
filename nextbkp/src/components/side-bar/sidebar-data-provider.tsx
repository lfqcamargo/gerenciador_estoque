import { getProfileCompany } from "@/http/get-profile-company";
import { AppSidebar } from "./app-sidebar";
import { getProfileUser } from "@/http/get-profile-user";

// Dados de navegação
const data = {
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
      icon: "BarChart3",
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
      icon: "Settings",
      items: [
        {
          title: "Configurações",
          url: "/configuracoes",
        },
      ],
    },
  ],
};

export async function SidebarDataProvider() {
  let profileCompany = null;
  let profileUser = null;

  try {
    profileCompany = await getProfileCompany();
  } catch (error) {
    console.error(error);
  }

  try {
    profileUser = await getProfileUser();
  } catch (error) {
    console.error(error);
  }

  return (
    <AppSidebar
      profileCompany={profileCompany}
      profileUser={profileUser}
      navData={data}
    />
  );
}
