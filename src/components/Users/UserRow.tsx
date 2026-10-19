"use client";
import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { formatDate, useRelativeTime } from "@/utils/date";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  lastActive: string | null;
  createdAt: string | null;
  avatar: string | null;
}

interface UserRowProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

function UserAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const normalized = role?.toLowerCase();
  const styles: Record<string, string> = {
    admin: "bg-red-100 text-red-700 ring-red-200",
    technician: "bg-blue-100 text-blue-700 ring-blue-200",
    user: "bg-green-100 text-green-700 ring-green-200",
  };
  const cls = styles[normalized] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  const lastActiveLabel = useRelativeTime(user.lastActive);
  const absoluteLastActive = formatDate(user.lastActive);
  const createdAtLabel = formatDate(user.createdAt);

  return (
    <TableRow>
      {/* User */}
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} avatar={user.avatar} />
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>

      {/* Last Active */}
      <TableCell className="text-gray-500">
        <Tooltip>
          <TooltipTrigger className="underline decoration-dashed underline-offset-4 cursor-default">
            {lastActiveLabel}
          </TooltipTrigger>
          <TooltipContent>{absoluteLastActive}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Created Date */}
      <TableCell className="text-gray-500">{createdAtLabel}</TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <ActionMenu
          button={
            <button
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="User actions"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          }
        >
          {(close) => (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); close(); onEdit?.(user); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); close(); onDelete?.(user); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          )}
        </ActionMenu>
      </TableCell>
    </TableRow>
  );
}
