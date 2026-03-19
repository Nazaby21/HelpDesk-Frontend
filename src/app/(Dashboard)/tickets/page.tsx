"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket } from "@/components/Tickets/TicketRow";
import { useRole } from "@/app/role-context";
import { useGetTicketsQuery } from "@/redux/feature/ticket/ticketApi";

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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tickets: Ticket[] = React.useMemo(() => {
    if (!apiTickets) return [];
    return apiTickets.map((t) => ({
      id: `#TCK-${t.id}`,
      title: t.ticketTitle || "Untitled",
      requester: { name: t.createdBy ? `User #${t.createdBy}` : "Unknown", email: "" },
      department: t.categoryName || "General",
      priority: formatPriority(t.priority),
      status: formatStatus(t.status ?? "PENDING"),
      assignedTo: t.assignedName ? { name: t.assignedName } : null,
      createdDate: formatDate(t.createdAt),
    }));
  }, [apiTickets]);

  const handleActionClick = (action: string, ticket: Ticket) => {
    if (action === "view") {
      router.push(`/tickets/${ticket.id.replace("#TCK-", "")}`);
    } else if (action === "accept") {
      setToastMessage("Ticket accepted successfully");
      setShowToast(true);
    } else if (action === "close") {
      setToastMessage("Ticket closed successfully");
      setShowToast(true);
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
          tickets={tickets}
          hideAssignedTo={role === "user"}
          onActionClick={handleActionClick}
          onCreateClick={() => router.push("/user/tickets")}
          onFilterClick={() => console.log("Filter")}
          onSearchChange={(val) => console.log("Search", val)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(tickets.length / 10) || 1}
          onPageChange={setCurrentPage}
          totalResults={tickets.length}
          resultsPerPage={10}
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
