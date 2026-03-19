"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/feature/auth/authSlice";
import { store } from "@/redux/store";
import type { RootState } from "@/redux/store";

export type UserRole = "ADMIN" | "TECHNICIAN" | "USER" | string;

export function RoleProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useRole() {
  const role = useAppSelector(selectCurrentRole) as UserRole;
  
  const setRole = (newRole: UserRole) => {
    console.warn("Manual role assignment is disabled. Roles originate from the backend API.");
  };

  return { role: role?.toLowerCase() || "user", setRole };
}
