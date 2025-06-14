"use client";

import type * as React from "react";
import { BarChart3, Box, Home, Settings } from "lucide-react";

import { NavMain } from "@/components/side-bar/nav-main";
import { NavUser } from "@/components/side-bar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { GetProfileCompanyResponse } from "@/http/get-profile-company";
import type { GetProfileUserResponse } from "@/http/get-profile-user";
import { CompanyInfo } from "./company-info";

// Mapeamento de strings para componentes Lucide
const iconMap = {
  Home: Home,
  Box: Box,
  BarChart3: BarChart3,
  Settings: Settings,
};

export function AppSidebar({
  profileCompany,
  profileUser,
  navData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  profileCompany: GetProfileCompanyResponse | null;
  profileUser: GetProfileUserResponse | null;
  navData: {
    navMain: {
      title: string;
      url: string;
      icon: string;
    }[];
  };
}) {
  // Converter strings de ícones para componentes reais
  const navMainWithIcons = navData.navMain.map((item) => ({
    ...item,
    icon: iconMap[item.icon as keyof typeof iconMap] || Box,
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {profileCompany && <CompanyInfo company={profileCompany} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithIcons} />
      </SidebarContent>
      <SidebarFooter>
        {profileUser && <NavUser user={profileUser} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
