import { api } from "../../api";

export interface TicketResponse {
  id: number;
  ticketTitle: string;
  description: string;
  priority: string;
  status: string;
  categoryId: number;
  categoryName: string;
  assignedTo: number | null;
  assignedName: string | null;
  logs: any[];
  createdBy: number;
  createdAt: string;
}

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<TicketResponse[], void>({
      query: () => "tickets",
      providesTags: ["Ticket"],
    }),
    getTicketById: builder.query<TicketResponse, string | number>({
      query: (id) => `tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "Ticket", id }],
    }),
    createTicket: builder.mutation<TicketResponse, Partial<TicketResponse>>({
      query: (body) => ({
        url: "tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),
  }),
});

export const { useGetTicketsQuery, useGetTicketByIdQuery, useCreateTicketMutation } = ticketApi;
