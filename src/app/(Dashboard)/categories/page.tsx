"use client";

import React from "react";
import { CategoryManager } from "@/components/Categories/CategoryManager";
import { useRole } from "@/app/role-context";
import { redirect } from "next/navigation";

export default function CategoriesPage() {
  const { role } = useRole();
  

  if (role !== "admin" && role !== "technician") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Category Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your categories and sub-issues.
            </p>
          </div>
        </div>
        <CategoryManager role={role} />
      </div>
    </div>
  );
}
