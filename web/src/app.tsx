import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="controle-financas">
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
