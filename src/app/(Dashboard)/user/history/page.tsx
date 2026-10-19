"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket, TicketPriority, TicketStatus } from "@/components/Tickets/TicketRow";
import { useGetTicketHistoryQuery, TicketResponse } from "@/redux/feature/ticket/ticketApi";
import { formatDate } from "@/utils/date";


const statusMap: Record<string, TicketStatus> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};
export default function UserHistoryPage() {
  const router = useRouter();
  
  const { data: ticketResponses = [], isLoading } = useGetTicketHistoryQuery();



  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 7;

  const tickets: Ticket[] = useMemo(() => {
    let mapped = ticketResponses.map((tr: TicketResponse) => {
      const status: TicketStatus = statusMap[tr.status] ?? "Completed";
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
        completedDate: tr.completedAt ? formatDate(tr.completedAt) : undefined,
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
    } else {
      setShowToast(true);
    }
  };

  if (isLoading) return <div className="p-8">Loading history...</div>;

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark">
        <TicketTable
            title="Ticket History"
            subtitle="View your past resolved or closed tickets."
            tickets={currentTickets}
            onActionClick={handleActionClick}
            onCreateClick={() => router.push("/incident-catalog")}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            showCompletedDate={true}
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
          message="Ticket action successful"
        />
      </div>
  );
}



