"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { RoleProvider } from "./role-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AuthGuard } from "@/components/AuthGuard";

import { TooltipProvider } from "@/components/ui/Tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <RoleProvider>
          <AuthGuard>
            <TooltipProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </TooltipProvider>
          </AuthGuard>
        </RoleProvider>
      </ThemeProvider>
    </Provider>
  );
}
