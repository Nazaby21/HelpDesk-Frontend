import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "./feature/auth/authSlice";
import { setToken, clearToken } from "./feature/auth/tokenSlice";
import type { RootState } from "./store";

// Base query with correct URLs for SSR and client-side
const baseQuery = fetchBaseQuery({
  baseUrl: typeof window === "undefined"
    ? `${process.env.API_URL || "http://localhost:8080"}/api/v1` // SSR (server-side)
    : `${process.env.NEXT_PUBLIC_API_URL}`, // Client-side production
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("X-Requested-With", "XMLHttpRequest");
    if (endpoint !== "login" && endpoint !== "refreshToken") {
      const token = (getState() as RootState).token.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query with automatic refresh token handling
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refresh token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(clearToken());
      api.dispatch(clearAuth());
      return result;
    }

    const refreshResult: any = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.accessToken) {
      api.dispatch(setToken(refreshResult.data.accessToken));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearToken());
      api.dispatch(clearAuth());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Ticket", "User", "Department", "Category"],
  endpoints: () => ({}),
});