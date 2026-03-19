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
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Category Management
        </h2>
      </div>
      <CategoryManager role={role} />
    </div>
  );
}
