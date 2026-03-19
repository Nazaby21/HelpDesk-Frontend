"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket, TicketPriority, TicketStatus } from "@/components/Tickets/TicketRow";
import { useRole } from "@/app/role-context";
import { useGetTicketsQuery } from "@/redux/feature/ticket/ticketApi";

export default function UserTicketsPage() {
  const router = useRouter();
  const { role } = useRole();
  
  const { data: ticketResponses = [], isLoading } = useGetTicketsQuery();

  const tickets: Ticket[] = useMemo(() => {
    return ticketResponses.map((tr) => {
      let status: TicketStatus = "Pending";
      if (tr.logs && tr.logs.length > 0) {
        const lastAction = tr.logs[tr.logs.length - 1].action;
        if (lastAction === "RESOLVE" || lastAction === "CLOSED") status = "Completed";
        else if (lastAction === "ASSIGN" || lastAction === "IN_PROGRESS" || lastAction === "UPDATE") status = "In Progress";
      }
      return {
        id: `#TCK-${tr.id.toString().padStart(3, "0")}`,
        title: tr.ticketTitle,
        requester: { name: "Requester", email: "" },
        department: tr.categoryName || "General",
        priority: (tr.priority as TicketPriority) || "Medium",
        status,
        assignedTo: tr.assignedName ? { name: tr.assignedName } : null,
        createdDate: new Date(tr.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      };
    }).filter(t => t.status !== "Completed");
  }, [ticketResponses]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleActionClick = (action: string, ticket: Ticket) => {
    if (action === "view") {
      router.push(`/tickets/${ticket.id.replace("#TCK-", "")}`);
    } else if (action === "edit") {
      router.push("/incident-catalog");
    } else {
      setToastMessage("Ticket updated successfully");
      setShowToast(true);
    }
  };

  if (isLoading) return <div className="p-8">Loading tickets...</div>;

  return (
    <>
      <div className="space-y-10">
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
          <TicketTable
            tickets={tickets}
            hideAssignedTo={true}
            onActionClick={handleActionClick}
            onCreateClick={() => router.push("/incident-catalog")}
            onFilterClick={() => console.log("Filter")}
            onSearchChange={(val) => console.log("Search", val)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            totalResults={2}
            resultsPerPage={10}
          />
        </div>

        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
        />
      </div>
    </>
  );
}
