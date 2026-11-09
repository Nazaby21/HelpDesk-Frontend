"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  NotificationItem,
} from "@/redux/feature/notification/notificationApi";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Bell, Check, CheckCheck, Trash2, Ticket, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/utils/date";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const pageSize = 10;

  const { data: pageData, isLoading, isError } = useGetNotificationsQuery({
    page: page - 1,
    size: pageSize,
    unreadOnly,
  });

  const { data: unreadCount = 0 } = useGetUnreadNotificationCountQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = pageData?.content || [];
  const totalPages = Math.max(1, pageData?.totalPages || 1);
  const totalElements = pageData?.totalElements ?? notifications.length;

  const handleOpenNotification = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id).unwrap();
      } catch {
        // Ignore and navigate
      }
    }
    if (item.ticketId) {
      router.push(`/tickets/${item.ticketId}`);
    } else if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkOneRead = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await markAsRead(id).unwrap();
      setToastMessage("Notification marked as read.");
      setShowToast(true);
    } catch {
      setToastMessage("Failed to mark notification as read.");
      setShowToast(true);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      setToastMessage("All notifications marked as read.");
      setShowToast(true);
    } catch {
      setToastMessage("Failed to mark all notifications as read.");
      setShowToast(true);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
      setToastMessage("Notification deleted.");
      setShowToast(true);
    } catch {
      setToastMessage("Failed to delete notification.");
      setShowToast(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 dark:border-dark-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="info">{unreadCount} Unread</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-6">
                Real-time alerts for ticket assignments, creations, and resolutions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-dark-3 dark:bg-dark-2">
              <button
                type="button"
                onClick={() => {
                  setUnreadOnly(false);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  !unreadOnly
                    ? "bg-white text-gray-900 shadow-sm dark:bg-dark-3 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnreadOnly(true);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  unreadOnly
                    ? "bg-white text-gray-900 shadow-sm dark:bg-dark-3 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Unread Only
              </button>
            </div>

            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || isMarkingAll}
              className="flex items-center gap-1.5 text-xs"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-500">
            Failed to load notifications. Please try again.
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {unreadOnly ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-6">
              {unreadOnly
                ? "You are all caught up! Switch to 'All' to view past notifications."
                : "Notifications about tickets will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-3">
            {notifications.map((item) => {
              const isResolved = item.type === "TICKET_RESOLVED";
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenNotification(item)}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-dark-3/60 ${
                    !item.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
                        isResolved
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Ticket className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm text-gray-900 dark:text-white ${
                            !item.isRead ? "font-bold" : "font-medium"
                          }`}
                        >
                          {item.title}
                        </span>
                        <Badge variant={isResolved ? "default" : "info"}>
                          {isResolved ? "RESOLVED" : "NEW TICKET"}
                        </Badge>
                        {!item.isRead && (
                          <span className="inline-block size-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {item.message || item.subTitle}
                      </p>
                      <p className="mt-1.5 text-xs text-gray-400 dark:text-dark-6">
                        {item.createdAt ? formatDateTime(item.createdAt) : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkOneRead(e, item.id)}
                        title="Mark as read"
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-white hover:text-primary dark:border-dark-3 dark:text-gray-300 dark:hover:bg-dark-2"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      title="Delete notification"
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-dark-3 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {notifications.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalResults={totalElements}
            resultsPerPage={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />
    </div>
  );
}
