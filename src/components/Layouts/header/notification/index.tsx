"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { BellIcon } from "./icons";
import { useGetActivityFeedQuery } from "@/redux/feature/ticket/ticketApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const currentUser = useAppSelector(selectCurrentUser);
  const storageKey = currentUser?.id ? `notifications:lastSeen:${currentUser.id}` : null;
  
  const { data: notifications = [], isLoading, isError, error } = useGetActivityFeedQuery(undefined, {
    skip: !currentUser?.id,
  });

  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setLastSeen(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }, [storageKey]);

  const hasUnread = useMemo(() => {
    if (notifications.length === 0) return false;
    if (!lastSeen) return true;
    
    const newestTime = new Date(notifications[0].createdAt).getTime();
    const lastSeenTime = new Date(lastSeen).getTime();
    return newestTime > lastSeenTime;
  }, [notifications, lastSeen]);
  
  const unreadCount = useMemo(() => {
    if (!lastSeen) return notifications.length;
    const lastSeenTime = new Date(lastSeen).getTime();
    return notifications.filter(n => new Date(n.createdAt).getTime() > lastSeenTime).length;
  }, [notifications, lastSeen]);

  const handleOpenChange = (value: React.SetStateAction<boolean>) => {
    const open = typeof value === "function" ? value(isOpen) : value;
    setIsOpen(open);
    if (open && notifications.length > 0 && storageKey) {
      const latestTimestamp = notifications[0].createdAt;
      setLastSeen(latestTimestamp);
      try {
        localStorage.setItem(storageKey, latestTimestamp);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const isUnauthorized = isError && (error as any)?.status === 401;

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={handleOpenChange}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {hasUnread && !isUnauthorized && !isError && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && !isUnauthorized && !isError && (
            <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto" role="menu">
          {isLoading ? (
            <li className="px-2 py-1.5 text-sm text-dark-5 dark:text-dark-6">Loading...</li>
          ) : isUnauthorized ? (
            <li className="px-2 py-1.5 text-sm text-red-500">Please sign in to view notifications.</li>
          ) : isError ? (
            <li className="px-2 py-1.5 text-sm text-red-500">Failed to load notifications.</li>
          ) : notifications.length === 0 ? (
            <li className="px-2 py-1.5 text-sm text-dark-5 dark:text-dark-6">No recent activity.</li>
          ) : (
            notifications.map((item, index) => (
              <li key={index} role="menuitem">
                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
                >
                  <Image
                    src={item.image || "/images/user/user-01.png"}
                    className="size-14 rounded-full object-cover shrink-0"
                    width={56}
                    height={56}
                    alt="User"
                  />
                  <div className="min-w-0">
                    <strong className="block text-sm font-medium text-dark dark:text-white truncate">
                      {item.title}
                    </strong>
                    <span className="block truncate text-sm font-medium text-dark-5 dark:text-dark-6">
                      {item.subTitle}
                    </span>
                    <span className="block text-xs text-dark-5 dark:text-dark-6 mt-0.5">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
}
