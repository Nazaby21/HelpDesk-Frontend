import { useState, useEffect } from "react";

export function formatDate(isoDate: string | null | Date | undefined): string {
  if (!isoDate) return "—";
  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh"
  }).format(date);
}

export function formatDateTime(isoDate: string | null | Date | undefined): string {
  if (!isoDate) return "—";
  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Phnom_Penh"
  }).format(date);
}

export function useRelativeTime(isoDate: string | null | Date | undefined): string {
  const [label, setLabel] = useState<string>("—");

  useEffect(() => {
    if (!isoDate) {
      setLabel("—");
      return;
    }

    const format = () => {
      const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
      if (isNaN(date.getTime())) return "—";

      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
      return formatDate(date);
    };

    setLabel(format());
    const interval = setInterval(() => setLabel(format()), 60_000);
    return () => clearInterval(interval);
  }, [isoDate]);

  return label;
}

