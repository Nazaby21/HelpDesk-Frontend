"use client";

import { useGetCategoriesQuery } from "@/redux/feature/category/categoryApi";
import { CategoryGrid } from "@/components/Helpdesk/CategoryGrid";
import { CreateCategoryModal } from "@/components/Helpdesk/CreateCategoryModal";
import { IncidentList } from "@/components/Helpdesk/IncidentList";
import { Sidebar } from "@/components/Helpdesk/Sidebar";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRole } from "@/app/role-context";
import { Incident } from "@/data/incidents";

export function IncidentCatalogView() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { role } = useRole();
  const isAgentOrAdmin = role === "technician" || role === "admin";

  const { data: categories = [] } = useGetCategoriesQuery();

  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(
    categoryParam || null
  );
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategoryName(categoryParam);
    }
  }, [categoryParam]);

  // Find the selected main category object
  const activeMainCategory = categories.find(
    (c) => c.name === activeCategoryName
  );

  // Directly access the nested SubCategories payload
  const subCategories = activeMainCategory?.subCategories || [];

  // Map SubCategories to Incident shape for the IncidentList Component
  const dynamicIncidents: Incident[] = subCategories.map((sub) => ({
    id: String(sub.id),
    title: sub.name,
    category: activeCategoryName || "Unknown Category",
    urgent: false,
    highlighted: false,
    description: sub.description || "",
    fields: [], // dynamic custom fields empty for now
  }));

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        <div className="flex-1 min-w-0">
          {!activeCategoryName ? (
            <CategoryGrid
              onCategorySelect={setActiveCategoryName}
              onCreateCategory={
                isAgentOrAdmin ? () => setShowCreateCategory(true) : undefined
              }
            />
          ) : (
            <IncidentList
              incidents={dynamicIncidents}
              categoryName={activeCategoryName}
              showBackButton={true}
              onBack={() => setActiveCategoryName(null)}
            />
          )}
        </div>
      </div>

      {isAgentOrAdmin && (
        <CreateCategoryModal
          isOpen={showCreateCategory}
          onClose={() => setShowCreateCategory(false)}
        />
      )}
    </>
  );
}
