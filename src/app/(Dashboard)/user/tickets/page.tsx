"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket, TicketPriority, TicketStatus } from "@/components/Tickets/TicketRow";
import { useRole } from "@/app/role-context";
import { useGetMyTicketsQuery } from "@/redux/feature/ticket/ticketApi";
import { formatDate } from "@/utils/date";


const statusMap: Record<string, TicketStatus> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};
export default function UserTicketsPage() {
  const router = useRouter();
  const { role } = useRole();
  
  const { data: ticketResponses = [], isLoading, error } = useGetMyTicketsQuery();





  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 7;

  const tickets: Ticket[] = useMemo(() => {
    let mapped = ticketResponses.map((tr) => {
      const status: TicketStatus = statusMap[tr.status] ?? "Pending";
      return {
        id: `#TCK-${tr.id.toString().padStart(3, "0")}`,
        rawId: tr.id.toString(),
        title: tr.ticketTitle,
        requester: { name: tr.createdByName || "Unknown", email: "" },
        department: tr.categoryName || "General",
        priority: (tr.priority as TicketPriority) || "Medium",
        status,
        assignedTo: tr.assignedName ? { name: tr.assignedName } : null,
        createdDate: formatDate(tr.createdAt),
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

  // Pagination slicing
  const totalPages = Math.ceil(tickets.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark">
        <TicketTable
            title="My Tickets"
            subtitle="View and track the status of your reported tickets."
            tickets={currentTickets}
            hideAssignedTo={true}
            onActionClick={handleActionClick}
            onCreateClick={() => router.push("/incident-catalog")}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalResults={tickets.length}
            resultsPerPage={itemsPerPage}
          />
        </div>

        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
        />
      </div>
  );
}



