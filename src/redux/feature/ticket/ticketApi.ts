import { api } from "../../api";

export interface TicketResponse {
  id: number;
  ticketTitle: string;
  description: string;
  priority: string;
  status: string;
  categoryId: number;
  categoryName: string;
  subCategoryId?: number;
  subCategoryName?: string;
  assignedTo: number | null;
  assignedName: string | null;
  logs: any[];
  createdBy: number;
  createdByName: string | null;
  createdAt: string;
  completedAt: string | null;
  imageUrl?: string;
}

export interface ChatMessage {
  id: number;
  ticketId: number;
  senderId: number;
  sender: string;
  content: string;
  timestamp: string;
}

export interface DashboardStats {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  totalUsers: number;
}

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<TicketResponse[], void>({
      query: () => "tickets",
      transformResponse: (response: { content: TicketResponse[] }) => response.content || [],
      providesTags: ["Ticket"],
    }),
    getTicketHistory: builder.query<TicketResponse[], void>({
      query: () => "tickets/history",
      transformResponse: (response: { content: TicketResponse[] }) => response.content || [],
      providesTags: ["Ticket"],
    }),
    getTicketById: builder.query<TicketResponse, string | number>({
      query: (id) => `tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "Ticket", id }],
    }),
    getTicketMessages: builder.query<ChatMessage[], string | number>({
      query: (id) => `tickets/${id}/messages`,
      providesTags: (result, error, id) => [{ type: "Ticket", id }],
    }),
    getMyTickets: builder.query<TicketResponse[], void>({
      query: () => "tickets/my",
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.content) return response.content;
        return [];
      },
      providesTags: ["Ticket"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "tickets/stats",
      providesTags: ["Ticket"],
    }),
    createTicket: builder.mutation<TicketResponse, Partial<TicketResponse>>({
      query: (body) => ({
        url: "tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),
    updateTicketStatus: builder.mutation<TicketResponse, { id: string | number; status: string; remark?: string }>({
      query: ({ id, status, remark }) => ({
        url: `tickets/${id}/status`,
        method: "PATCH",
        body: { status, remark },
      }),
      invalidatesTags: ["Ticket"],
    }),
    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "images/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGetTicketsQuery, useGetTicketHistoryQuery, useGetTicketByIdQuery, useGetTicketMessagesQuery, useGetMyTicketsQuery, useGetDashboardStatsQuery, useCreateTicketMutation, useUpdateTicketStatusMutation, useUploadImageMutation } = ticketApi;

