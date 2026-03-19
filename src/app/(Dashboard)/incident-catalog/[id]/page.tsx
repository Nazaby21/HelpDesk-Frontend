import React from "react";
import { TicketDetailView } from "@/components/Helpdesk/ticket/TicketDetailView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <TicketDetailView
      id={id}
    />
  );
}
