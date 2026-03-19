import React from "react";
import { INCIDENT_TEMPLATES } from "@/data/incidents";
import { TicketDetailView } from "@/components/Helpdesk/ticket/TicketDetailView";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTicketPage({ params }: PageProps) {
  const { id } = await params;
  
  // In a real app we would load the actual ticket details here
  // For the UI demonstration, we load a mock title
  const ticketTitle = "Cannot access company VPN";
  const category = "IT Security Issue";

  return (
    <>
      <Breadcrumb pageName="Edit Ticket" />
      <TicketDetailView id={id} />
    </>
  );
}
