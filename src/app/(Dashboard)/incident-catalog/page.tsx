"use client";

import React, { Suspense } from "react";
import { IncidentCatalogView } from "@/components/Helpdesk/IncidentCatalogView";

export default function IncidentCatalogPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading catalog...</div>}>
      <IncidentCatalogView />
    </Suspense>
  );
}

