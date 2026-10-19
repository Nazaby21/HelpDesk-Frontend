"use client";

import React from "react";
import { CategoryManager } from "@/components/Categories/CategoryManager";
import { useRole } from "@/app/role-context";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CategoriesPage() {
  const { role } = useRole();
  

  if (role !== "admin" && role !== "technician") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark">
        <CategoryManager role={role} />
      </div>
    </div>
  );
}
