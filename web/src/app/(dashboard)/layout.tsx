import type React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import { SidebarDataProvider } from "@/components/sidebar-data-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <SidebarDataProvider />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
