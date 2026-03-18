import React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { TableRow, TableCell } from "@/components/ui/table";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  dateAdded: string;
  avatar: string;
}

interface UserRowProps {
  user: User;
  onActionClick?: (user: User) => void;
}

export function UserRow({ user, onActionClick }: UserRowProps) {
  const roleStyles: Record<string, "success" | "info" | "purple" | "default"> = {
    Admin: "success",
    Technician: "info",
    User: "purple",
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full bg-gray-100 object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={roleStyles[user.role] || "default"}>{user.role}</Badge>
      </TableCell>
      <TableCell className="text-gray-500">{user.lastActive}</TableCell>
      <TableCell className="text-gray-500">{user.dateAdded}</TableCell>
      <TableCell className="text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onActionClick) onActionClick(user);
          }}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="User actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </TableCell>
    </TableRow>
  );
}
