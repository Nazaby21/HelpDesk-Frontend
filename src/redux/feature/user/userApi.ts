import { api } from "../../api";

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  imageUrl: string | null;
  role: string;
  departmentId: number;
  departmentName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: string;
  departmentId?: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserResponse, CreateUserDto>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<UserResponse, number | string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation<UserResponse, { id: number | string; data: Partial<CreateUserDto> }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation
} = userApi;
