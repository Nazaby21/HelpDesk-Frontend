"use client";
import React, { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

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

/** Format an ISO date string as a relative time like "3 hours ago" */
function useRelativeTime(isoDate: string | null): string {
  const [label, setLabel] = useState("—");

  useEffect(() => {
    if (!isoDate) { setLabel("—"); return; }

    const format = () => {
      const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
      return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    setLabel(format());
    const interval = setInterval(() => setLabel(format()), 60_000);
    return () => clearInterval(interval);
  }, [isoDate]);

  return label;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const lastActiveLabel = useRelativeTime(user.lastActive);
  const createdAtLabel = useRelativeTime(user.createdAt);

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
      <TableCell className="text-gray-500">{lastActiveLabel}</TableCell>

      {/* Created Date */}
      <TableCell className="text-gray-500">{createdAtLabel}</TableCell>

      {/* Actions */}
      <TableCell className="relative text-right">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="User actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {menuOpen && (
          <div className="absolute right-8 top-10 z-20 w-40 animate-in fade-in zoom-in-95 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit?.(user); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(user); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
