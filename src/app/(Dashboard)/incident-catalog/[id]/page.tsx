import React from "react";
import { INCIDENT_TEMPLATES } from "@/data/incidents";
import { notFound } from "next/navigation";
import { TicketDetailView } from "@/components/Helpdesk/ticket/TicketDetailView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return INCIDENT_TEMPLATES.map((incident) => ({
    id: incident.id,
  }));
}

export default async function TicketDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const incident = INCIDENT_TEMPLATES.find((i) => i.id === id);

  if (!incident) {
    notFound();
  }

  return (
    <TicketDetailView
      id={id}
      incidentTitle={incident.title}
      incidentCategory={incident.category}
    />
  );
}
