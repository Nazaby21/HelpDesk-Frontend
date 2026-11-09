"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { Toast } from "@/components/ui/Toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BellIcon } from "./icons";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  NotificationItem,
} from "@/redux/feature/notification/notificationApi";
import { api } from "@/redux/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/feature/auth/authSlice";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCheck, Ticket, CheckCircle2 } from "lucide-react";

dayjs.extend(relativeTime);

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector((state) => state.token.accessToken);

  const stompClientRef = useRef<Client | null>(null);
  const seenIdsRef = useRef<Set<number>>(new Set());

  const {
    data: pageData,
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery(
    { page: 0, size: 8, unreadOnly: false },
    { skip: !currentUser?.id || !isAuthenticated }
  );

  const { data: unreadCount = 0 } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !currentUser?.id || !isAuthenticated,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  const notifications = pageData?.content || [];

  // Real-time WebSocket subscription: connect on login, auto-reconnect, close on logout
  useEffect(() => {
    if (!isAuthenticated || !accessToken || !currentUser?.id) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      return;
    }

    const handleIncoming = (body: string) => {
      try {
        const incoming = JSON.parse(body) as NotificationItem;
        if (!incoming || !incoming.id) return;
        if (seenIdsRef.current.has(incoming.id)) return;
        seenIdsRef.current.add(incoming.id);

        dispatch(api.util.invalidateTags(["Notification", "Ticket"]));
        setToastNotification(incoming);
      } catch (e) {
        console.error("Failed to parse real-time notification", e);
      }
    };

    const client = new Client({
      webSocketFactory: () => {
        const wsEnv = process.env.NEXT_PUBLIC_WS_URL;
        if (wsEnv && wsEnv.startsWith("http")) {
          return new SockJS(wsEnv);
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const backendUrl =
          apiUrl && apiUrl.startsWith("http")
            ? apiUrl.replace(/\/api\/v1\/?$/, "")
            : "http://localhost:8080";
        return new SockJS(`${backendUrl}/ws-chat`);
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/notifications", (msg) => {
          handleIncoming(msg.body);
        });
        client.subscribe(`/topic/notifications/${currentUser.id}`, (msg) => {
          handleIncoming(msg.body);
        });
      },
      onStompError: () => {
        // Auto-reconnect handled by StompJS
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [isAuthenticated, accessToken, currentUser?.id, dispatch]);

  const handleNotificationClick = async (item: NotificationItem) => {
    setIsOpen(false);
    if (!item.isRead) {
      try {
        await markAsRead(item.id).unwrap();
      } catch {
        // Ignore error and still navigate
      }
    }
    if (item.ticketId) {
      router.push(`/tickets/${item.ticketId}`);
    } else if (item.link) {
      router.push(item.link);
    } else {
      router.push("/notifications");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  };

  const isUnauthorized = isError && (error as any)?.status === 401;

  return (
    <>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger
          className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
          aria-label="View Notifications"
        >
          <span className="relative">
            <BellIcon />
            {unreadCount > 0 && !isUnauthorized && !isError && (
              <span
                className={cn(
                  "absolute -right-1.5 -top-1.5 z-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-gray-2 dark:ring-dark-3"
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
        </DropdownTrigger>

        <DropdownContent
          align={isMobile ? "end" : "center"}
          className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[23rem] max-w-[26rem]"
        >
          <div className="mb-2 flex items-center justify-between border-b border-stroke pb-2 px-2 dark:border-dark-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-dark dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && !isUnauthorized && !isError && (
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <ul className="mb-2 max-h-[22rem] space-y-1.5 overflow-y-auto" role="menu">
            {isLoading ? (
              <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-dark-6">
                Loading notifications...
              </li>
            ) : isUnauthorized ? (
              <li className="px-2 py-4 text-center text-sm text-red-500">
                Please sign in to view notifications.
              </li>
            ) : isError ? (
              <li className="px-2 py-4 text-center text-sm text-red-500">
                Failed to load notifications.
              </li>
            ) : notifications.length === 0 ? (
              <li className="px-2 py-6 text-center text-sm text-dark-5 dark:text-dark-6">
                No notifications yet.
              </li>
            ) : (
              notifications.map((item) => {
                const isResolved = item.type === "TICKET_RESOLVED";
                return (
                  <li key={item.id} role="menuitem">
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3",
                        !item.isRead && "bg-primary/5 dark:bg-primary/10"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                          isResolved
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        {isResolved ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Ticket className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <strong
                            className={cn(
                              "block truncate text-sm text-dark dark:text-white",
                              !item.isRead ? "font-semibold" : "font-medium"
                            )}
                          >
                            {item.title}
                          </strong>
                          {!item.isRead && (
                            <span className="size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="mt-0.5 line-clamp-2 block text-xs text-dark-5 dark:text-dark-6">
                          {item.message || item.subTitle}
                        </span>
                        <span className="mt-1 block text-[11px] text-gray-400 dark:text-dark-6">
                          {dayjs(item.createdAt).fromNow()}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t border-stroke pt-2 text-center dark:border-dark-3">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block rounded-md py-1.5 text-xs font-semibold text-primary hover:bg-gray-2 dark:hover:bg-dark-3"
            >
              View All Notifications
            </Link>
          </div>
        </DropdownContent>
      </Dropdown>

      <Toast
        isOpen={Boolean(toastNotification)}
        onClose={() => setToastNotification(null)}
        type="info"
        duration={5000}
        message={
          toastNotification
            ? `${toastNotification.title} — ${toastNotification.message}`
            : ""
        }
        action={
          toastNotification?.ticketId
            ? {
                label: "View Ticket",
                onClick: () => {
                  const target = toastNotification;
                  setToastNotification(null);
                  if (target) {
                    handleNotificationClick(target);
                  }
                },
              }
            : undefined
        }
      />
    </>
  );
}
