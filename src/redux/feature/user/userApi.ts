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
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = userApi;

