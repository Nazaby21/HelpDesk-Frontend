"use client";

import { CategoryGrid } from "@/components/Helpdesk/CategoryGrid";
import { CreateCategoryModal } from "@/components/Helpdesk/CreateCategoryModal";
import { IncidentList } from "@/components/Helpdesk/IncidentList";
import { Sidebar } from "@/components/Helpdesk/Sidebar";
import { INCIDENT_TEMPLATES } from "@/data/incidents";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRole } from "@/app/role-context";

export function IncidentCatalogView() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { role } = useRole();
  const isAgentOrAdmin = role === "technician" || role === "admin";

  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryParam || (isAgentOrAdmin ? null : "IT Support Issue")
  );
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredIncidents = INCIDENT_TEMPLATES.filter(
    (incident) => incident.category === activeCategory
  );

  const showSidebar = role !== "user" && !isAgentOrAdmin;
  const showGridHome = isAgentOrAdmin;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        {showSidebar && (
          <Sidebar
            activeCategory={activeCategory || "IT Support Issue"}
            onCategorySelect={setActiveCategory}
          />
        )}
        <div className="flex-1 min-w-0">
          {!activeCategory && showGridHome ? (
            <CategoryGrid
              onCategorySelect={setActiveCategory}
              onCreateCategory={
                isAgentOrAdmin ? () => setShowCreateCategory(true) : undefined
              }
            />
          ) : (
            <IncidentList
              incidents={filteredIncidents}
              categoryName={activeCategory || "IT Support Issue"}
              showBackButton={showGridHome}
              onBack={() => setActiveCategory(null)}
            />
          )}
        </div>
      </div>

      {/* Create Category Modal — only rendered for admin/technician */}
      {isAgentOrAdmin && (
        <CreateCategoryModal
          isOpen={showCreateCategory}
          onClose={() => setShowCreateCategory(false)}
        />
      )}
    </>
  );
}
