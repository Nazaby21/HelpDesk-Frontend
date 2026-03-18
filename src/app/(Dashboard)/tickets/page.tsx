"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Ticket } from "@/components/Tickets/TicketRow";

const mockTickets: Ticket[] = [
  {
    id: "#TCK-001",
    title: "Cannot access company VPN",
    requester: { name: "Sarah Doe", email: "sarah@example.com" },
    department: "IT",
    priority: "High",
    status: "Pending",
    assignedTo: { name: "John Smith" },
    createdDate: "Oct 24, 2024",
  },
  {
    id: "#TCK-002",
    title: "Request for new software license",
    requester: { name: "Mike Johnson", email: "mike@example.com" },
    department: "Finance",
    priority: "Low",
    status: "Completed",
    assignedTo: { name: "Amélie" },
    createdDate: "Oct 23, 2024",
  },
  {
    id: "#TCK-003",
    title: "Blue screen of death on boot",
    requester: { name: "Emily Chen", email: "emily@example.com" },
    department: "Support",
    priority: "High",
    status: "In Progress",
    assignedTo: { name: "John Smith" },
    createdDate: "Oct 22, 2024",
  },
  {
    id: "#TCK-004",
    title: "Onboarding documentation update needed",
    requester: { name: "David Wilson", email: "david@example.com" },
    department: "HR",
    priority: "Medium",
    status: "Completed",
    assignedTo: null,
    createdDate: "Oct 21, 2024",
  },
];

export default function AllTicketsPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleActionClick = (action: string, ticket: Ticket) => {
    if (action === "view") {
      router.push(`/tickets/${ticket.id.replace("#", "")}`);
    } else {
      setShowToast(true);
    }
  };

  return (
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <TicketTable
            tickets={mockTickets}
            onActionClick={handleActionClick}
            onCreateClick={() => console.log("Create Ticket")}
            onFilterClick={() => console.log("Filter")}
            onSearchChange={(val) => console.log("Search", val)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
            totalResults={12}
            resultsPerPage={4}
          />
        </div>

        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message="Ticket updated successfully"
        />
      </div>
  );
}
