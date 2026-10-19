import React from "react";
import { Badge } from "@/components/ui/Badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useRole } from "@/app/role-context";
import { ActionMenu } from "@/components/ui/ActionMenu";

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
  completedDate?: string;
}

interface TicketRowProps {
  ticket: Ticket;
  onActionClick: (action: string, ticket: Ticket) => void;
  hideAssignedTo?: boolean;
  showCompletedDate?: boolean;
}

export function TicketRow({
  ticket,
  onActionClick,
  hideAssignedTo = false,
  showCompletedDate = false,
}: TicketRowProps) {
  const { role } = useRole();

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    const variants: Record<TicketStatus, any> = {
      Pending: "info",
      "In Progress": "warning",
      Completed: "success",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
    const normalized = priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase() as TicketPriority;
    const variants: Record<TicketPriority, any> = {
      Low: "warning",
      Medium: "orange",
      High: "error",
    };
    return <Badge variant={variants[normalized] ?? "default"}>{normalized}</Badge>;
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
      {!hideAssignedTo && (
        <TableCell>
          {ticket.assignedTo ? (
            <span className="text-gray-700">{ticket.assignedTo.name}</span>
          ) : (
            <span className="text-gray-400 italic">Unassigned</span>
          )}
        </TableCell>
      )}
      <TableCell className="whitespace-nowrap text-gray-500">
        {ticket.createdDate}
      </TableCell>
      {showCompletedDate && (
        <TableCell className="whitespace-nowrap text-gray-500">
          {ticket.completedDate || "—"}
        </TableCell>
      )}
      <TableCell className="relative text-right">
        <ActionMenu
          button={
            <button
              aria-label="Ticket actions"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          }
        >
          {(close) => (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick("view", ticket);
                  close();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                View Details
              </button>

              {/* Edit (Users Only - and only if Pending) */}
              {role === "user" && ticket.status === "Pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick("edit", ticket);
                    close();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
              )}

              {/* Technician/Admin Actions */}
              {role !== "user" && ticket.status === "Pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick("accept", ticket);
                    close();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Accept
                </button>
              )}

              {role !== "user" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick("close", ticket);
                    close();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10"
                >
                  Close Ticket
                </button>
              )}
            </>
          )}
        </ActionMenu>
      </TableCell>
    </TableRow>
  );
}
