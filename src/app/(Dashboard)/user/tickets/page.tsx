"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket, TicketPriority, TicketStatus } from "@/components/Tickets/TicketRow";
import { useRole } from "@/app/role-context";
import { useGetMyTicketsQuery } from "@/redux/feature/ticket/ticketApi";

export default function UserTicketsPage() {
  const router = useRouter();
  const { role } = useRole();
  
  const { data: ticketResponses = [], isLoading, error } = useGetMyTicketsQuery();
  console.log("MY TICKETS API RESPONSE:", ticketResponses, error);

  const statusMap: Record<string, TicketStatus> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };



  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const tickets: Ticket[] = useMemo(() => {
    let mapped = ticketResponses.map((tr) => {
      const status: TicketStatus = statusMap[tr.status] ?? "Pending";
      return {
        id: `#TCK-${tr.id.toString().padStart(3, "0")}`,
        rawId: tr.id.toString(),
        title: tr.ticketTitle,
        requester: { name: "Requester", email: "" },
        department: tr.categoryName || "General",
        priority: (tr.priority as TicketPriority) || "Medium",
        status,
        assignedTo: tr.assignedName ? { name: tr.assignedName } : null,
        createdDate: new Date(tr.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      };
    });

    // Filter by status
    if (statusFilter !== "ALL") {
      mapped = mapped.filter((t) => t.status.toUpperCase().replace(" ", "_") === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      mapped = mapped.filter(
        (t) =>
          t.id.toLowerCase().includes(lowerQ) ||
          t.title.toLowerCase().includes(lowerQ) ||
          t.department.toLowerCase().includes(lowerQ)
      );
    }

    return mapped;
  }, [ticketResponses, statusFilter, searchQuery]);

  const handleActionClick = (action: string, ticket: Ticket) => {
    if (action === "view") {
      router.push(`/tickets/${(ticket as any).rawId ?? ticket.id.replace("#TCK-", "")}`);
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
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
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
