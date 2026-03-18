import React from "react";
import { Badge } from "@/components/ui/Badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

export type TicketStatus = "Pending" | "In Progress" | "Completed";
export type TicketPriority = "Low" | "Medium" | "High";

export interface Ticket {
  id: string;
  title: string;
  requester: { name: string; email: string };
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: { name: string } | null;
  createdDate: string;
}

interface TicketRowProps {
  ticket: Ticket;
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
  onActionClick: (action: string, ticket: Ticket) => void;
}

export function TicketRow({
  ticket,
  activeMenuId,
  onMenuToggle,
  onActionClick,
}: TicketRowProps) {
  const isMenuOpen = activeMenuId === ticket.id;

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    const variants: Record<TicketStatus, any> = {
      Pending: "info",
      "In Progress": "warning",
      Completed: "success",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
    const variants: Record<TicketPriority, any> = {
      Low: "default",
      Medium: "info",
      High: "warning",
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  return (
    <TableRow
      className={`${
        ticket.priority === "High" && ticket.status === "Pending"
          ? "border-l-2 border-l-red-500"
          : ""
      }`}
    >
      <TableCell className="font-medium text-gray-900">{ticket.id}</TableCell>
      <TableCell
        className="max-w-[200px] truncate font-semibold text-gray-900"
        title={ticket.title}
      >
        {ticket.title}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-gray-900">
            {ticket.requester.name}
          </div>
          <div className="text-xs text-gray-500">{ticket.requester.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-gray-600">{ticket.department}</span>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={ticket.priority} />
      </TableCell>
      <TableCell>
        <StatusBadge status={ticket.status} />
      </TableCell>
      <TableCell>
        {ticket.assignedTo ? (
          <span className="text-gray-700">{ticket.assignedTo.name}</span>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-500">
        {ticket.createdDate}
      </TableCell>
      <TableCell className="relative text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle(isMenuOpen ? null : ticket.id);
          }}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-8 top-10 z-10 w-48 animate-in fade-in zoom-in-95 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {[
              { label: "View Details", action: "view" },
              { label: "Edit", action: "edit" },
              { label: "Assign", action: "assign" },
            ].map(({ label, action }) => (
              <button
                key={action}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick(action, ticket);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {label}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick("close", ticket);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Close Ticket
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
