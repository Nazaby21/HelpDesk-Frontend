import { api } from "../../api";
import { User } from "./authSlice";

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string; // your DB-stored refresh token
}

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        // If the backend returned a nested user object, use it.
        if (response.user) {
          return {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken || "",
            user: response.user,
          };
        }
        
        // Handle flat backend response
        return {
          accessToken: response.accessToken || response.token,
          refreshToken: response.refreshToken || "",
          user: {
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            departmentId: response.departmentId,
            role: response.role,
            imageUrl: response.imageUrl,
          },
        };
      },
    }),
    refreshToken: builder.mutation<{ accessToken: string }, RefreshTokenRequest>({
      query: (body) => ({
        url: "auth/refresh",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;