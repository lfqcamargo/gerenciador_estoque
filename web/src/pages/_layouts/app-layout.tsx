import { isAuthenticated } from "@/auth/is-authenticate";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { SidebarDataProvider } from "@/components/side-bar/sidebar-data-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        navigate("/auth/sign-in");
      }
    }
    checkAuth();
  }, [navigate]);

  return (
    <SidebarProvider>
      <SidebarDataProvider />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
