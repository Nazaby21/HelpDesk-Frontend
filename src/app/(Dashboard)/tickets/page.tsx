"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket } from "@/components/Tickets/TicketRow";
import { useRole } from "@/app/role-context";
import { useGetTicketsQuery, useUpdateTicketStatusMutation } from "@/redux/feature/ticket/ticketApi";

function formatPriority(p: string): "Low" | "Medium" | "High" {
  const map: Record<string, "Low" | "Medium" | "High"> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return map[p] ?? "Medium";
}

function formatStatus(s: string): "Pending" | "In Progress" | "Completed" {
  const map: Record<string, "Pending" | "In Progress" | "Completed"> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    "In Progress": "In Progress",
    Pending: "Pending",
    Completed: "Completed",
  };
  return map[s] ?? "Pending";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AllTicketsPage() {
  const router = useRouter();
  const { role } = useRole();
  const { data: apiTickets, isLoading } = useGetTicketsQuery();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 7;

  const tickets: Ticket[] = React.useMemo(() => {
    if (!apiTickets) return [];
    
    // 1. Map to frontend format
    let mapped = apiTickets.map((t) => ({
      id: `#TCK-${t.id}`,
      rawId: t.id.toString(),
      title: t.ticketTitle || "Untitled",
      requester: { name: t.createdByName || "Unknown", email: "" },
      department: t.categoryName || "General",
      priority: formatPriority(t.priority),
      status: formatStatus(t.status ?? "PENDING"),
      assignedTo: t.assignedName ? { name: t.assignedName } : null,
      createdDate: formatDate(t.createdAt),
    }));

    // 2. Filter by status
    if (statusFilter !== "ALL") {
      mapped = mapped.filter((t) => formatStatus(t.status).toUpperCase().replace(" ", "_") === statusFilter);
    }

    // 3. Filter by search
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
  }, [apiTickets, statusFilter, searchQuery]);

  // Pagination slicing
  const totalPages = Math.ceil(tickets.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  const handleActionClick = (action: string, ticket: Ticket) => {
    const rawId = (ticket as any).rawId;
    if (action === "view") {
      router.push(`/tickets/${rawId}`);
    } else if (action === "accept") {
      updateTicketStatus({ id: rawId, status: "IN_PROGRESS", remark: "Accepted by technician" })
        .unwrap()
        .then(() => {
          setToastMessage("Ticket accepted successfully");
          setShowToast(true);
        })
        .catch((err) => console.error("Failed to accept ticket", err));
    } else if (action === "close") {
      updateTicketStatus({ id: rawId, status: "COMPLETED", remark: "Closed by technician" })
        .unwrap()
        .then(() => {
          setToastMessage("Ticket closed successfully");
          setShowToast(true);
        })
        .catch((err) => console.error("Failed to close ticket", err));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-500">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <TicketTable
          tickets={currentTickets}
          hideAssignedTo={role === "user"}
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
