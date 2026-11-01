import React from "react";
import { EditTicketView } from "@/components/Helpdesk/ticket/EditTicketView";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTicketPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb pageName="Edit Ticket" />
      <EditTicketView id={id} />
    </>
  );
}
