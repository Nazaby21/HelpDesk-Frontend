import { api } from "../../api";

export interface NotificationItem {
  id: number;
  recipientId: number;
  type: "TICKET_CREATED" | "TICKET_RESOLVED" | string;
  title: string;
  message: string;
  subTitle?: string;
  image?: string;
  ticketId: number | null;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPageResponse {
  content: NotificationItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
  count: number;
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationPageResponse,
      { page?: number; size?: number; unreadOnly?: boolean } | void
    >({
      query: (params) => {
        const page = params && "page" in params && params.page !== undefined ? params.page : 0;
        const size = params && "size" in params && params.size !== undefined ? params.size : 10;
        const unreadOnly = params && "unreadOnly" in params && params.unreadOnly ? true : false;
        return `notifications?page=${page}&size=${size}&unreadOnly=${unreadOnly}`;
      },
      providesTags: ["Notification"],
    }),
    getUnreadNotificationCount: builder.query<number, void>({
      query: () => "notifications/unread-count",
      transformResponse: (response: UnreadCountResponse | number) => {
        if (typeof response === "number") return response;
        return response?.unreadCount ?? response?.count ?? 0;
      },
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation<NotificationItem, number>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation<{ updatedCount: number; message: string }, void>({
      query: () => ({
        url: "notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    registerDeviceToken: builder.mutation<
      { id: number; token: string; platform: string; message: string },
      { token: string; platform: "WEB" | "ANDROID" | "IOS" }
    >({
      query: (body) => ({
        url: "devices",
        method: "POST",
        body,
      }),
    }),
    unregisterDeviceToken: builder.mutation<void, string>({
      query: (token) => ({
        url: `devices/${encodeURIComponent(token)}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useRegisterDeviceTokenMutation,
  useUnregisterDeviceTokenMutation,
} = notificationApi;
