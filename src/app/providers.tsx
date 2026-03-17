"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { RoleProvider } from "./role-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <RoleProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
