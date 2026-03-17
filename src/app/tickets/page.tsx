"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// Types and Mock Data
type TicketStatus = "Pending" | "In Progress" | "Completed";
type TicketPriority = "Low" | "Medium" | "High";

interface Ticket {
  id: string;
  title: string;
  requester: { name: string; email: string; avatar: string };
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: { name: string; avatar: string } | null;
  createdDate: string;
}

const mockTickets: Ticket[] = [
  {
    id: "#TCK-001",
    title: "Cannot access company VPN",
    requester: { name: "Sarah Doe", email: "sarah@example.com", avatar: "https://i.pravatar.cc/150?u=sarah" },
    department: "IT",
    priority: "High",
    status: "Pending",
    assignedTo: { name: "John Smith", avatar: "https://i.pravatar.cc/150?u=john" },
    createdDate: "Oct 24, 2024",
  },
  {
    id: "#TCK-002",
    title: "Request for new software license",
    requester: { name: "Mike Johnson", email: "mike@example.com", avatar: "https://i.pravatar.cc/150?u=mike" },
    department: "Finance",
    priority: "Low",
    status: "Completed",
    assignedTo: { name: "Amélie", avatar: "https://i.pravatar.cc/150?u=amelie" },
    createdDate: "Oct 23, 2024",
  },
  {
    id: "#TCK-003",
    title: "Blue screen of death on boot",
    requester: { name: "Emily Chen", email: "emily@example.com", avatar: "https://i.pravatar.cc/150?u=emily" },
    department: "Support",
    priority: "High",
    status: "In Progress",
    assignedTo: { name: "John Smith", avatar: "https://i.pravatar.cc/150?u=john" },
    createdDate: "Oct 22, 2024",
  },
  {
    id: "#TCK-004",
    title: "Onboarding documentation update needed",
    requester: { name: "David Wilson", email: "david@example.com", avatar: "https://i.pravatar.cc/150?u=david" },
    department: "HR",
    priority: "Medium",
    status: "Completed",
    assignedTo: null,
    createdDate: "Oct 21, 2024",
  },
];

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles: Record<TicketStatus, string> = {
    Pending: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${styles[status]}`}>{status}</span>;
};

const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const styles: Record<TicketPriority, string> = {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-orange-100 text-orange-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${styles[priority]}`}>{priority}</span>;
};

export default function AllTicketsPage() {
  const [showToast, setShowToast] = useState(false);
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);

  const simulateAction = () => {
    setActiveActionsMenu(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex-1 bg-white md:p-6 p-4">
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage all support tickets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:w-64"
                />
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Create Ticket
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 pl-4 pr-3 font-medium whitespace-nowrap">Ticket ID</th>
                  <th className="px-3 py-3 font-medium">Title</th>
                  <th className="px-3 py-3 font-medium">Requester</th>
                  <th className="px-3 py-3 font-medium">Department</th>
                  <th className="px-3 py-3 font-medium">Priority</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Assigned To</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">Created Date</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className={`group transition-colors hover:bg-gray-50 cursor-pointer ${ticket.priority === 'High' && ticket.status === 'Pending' ? 'border-l-2 border-l-red-500' : ''}`}
                  >
                    <td className="py-4 pl-4 pr-3 font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-3 py-4 font-semibold text-gray-900 max-w-[200px] truncate" title={ticket.title}>
                      {ticket.title}
                    </td>
                    <td className="px-3 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.requester.name}</div>
                        <div className="text-xs text-gray-500">{ticket.requester.email}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-gray-600">{ticket.department}</span>
                    </td>
                    <td className="px-3 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-3 py-4">
                      {ticket.assignedTo ? (
                        <span className="text-gray-700">{ticket.assignedTo.name}</span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-gray-500 whitespace-nowrap">{ticket.createdDate}</td>
                    <td className="px-4 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setActiveActionsMenu(activeActionsMenu === ticket.id ? null : ticket.id)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeActionsMenu === ticket.id && (
                        <div className="absolute right-8 top-10 z-10 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95">
                          <button onClick={simulateAction} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">View Details</button>
                          <button onClick={simulateAction} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                          <button onClick={simulateAction} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Assign</button>
                          <button onClick={simulateAction} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Close Ticket</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">4</span> of <span className="font-medium text-gray-900">12</span> results
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-400">...</span>
              <button
                className="h-9 w-9 rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                10
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span>Ticket updated successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}
