import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "./feature/auth/authSlice";
import { setToken, clearToken } from "./feature/auth/tokenSlice";
import type { RootState } from "./store";

// const baseQuery = fetchBaseQuery({
//   baseUrl: typeof window === "undefined" 
//     ? `${process.env.API_URL || "http://localhost:8080"}/api/v1/`  // SSR requests go directly to backend
//     : "/api/v1/", // Client requests use Next.js proxy to avoid CORS
//   credentials: "include", // Allow cookie propagation if backend requires it for refresh token
//   prepareHeaders: (headers, { getState, endpoint }) => {
//     // This strictly tells Spring Security this is an AJAX request, suppressing the browser's native HTTP Basic Auth popup on 401s!
//     headers.set("X-Requested-With", "XMLHttpRequest");
    
//     // Prevent attaching a potentially expired token on login/refresh calls resulting in 401
//     if (endpoint === "login" || endpoint === "refreshToken") {
//       return headers;
//     }

//     const token = (getState() as RootState).token.accessToken;
//     console.log(`PREPARE HEADERS (${endpoint}) - Token from Redux: `, token ? `${token.substring(0, 15)}...` : "UNDEFINED/NULL");
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

const baseQuery = fetchBaseQuery({
  baseUrl: typeof window === "undefined"
    ? `${process.env.API_URL || "http://localhost:8080"}/api/v1/`
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}`,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("X-Requested-With", "XMLHttpRequest");

    if (endpoint === "login" || endpoint === "refreshToken") return headers;

    const token = (getState() as RootState).token.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Get refresh token from user (e.g., saved in Redux or frontend state)
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(clearToken());
      api.dispatch(clearAuth());
      return result;
    }

    // Call refresh token endpoint
    const refreshResult: any = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setToken(refreshResult.data.accessToken));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed
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
