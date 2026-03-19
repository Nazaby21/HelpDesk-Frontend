import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import authReducer, { AuthState } from "./feature/auth/authSlice";
import tokenReducer from "./feature/auth/tokenSlice";

// ── Rehydrate from localStorage (only in browser) ──────────────────────────
function loadAuthFromStorage(): Partial<AuthState> {
  if (typeof window === "undefined") return {};
  try {
    const user = localStorage.getItem("auth_user");
    const refreshToken = localStorage.getItem("auth_refresh_token");
    if (user && refreshToken) {
      return {
        user: JSON.parse(user),
        refreshToken,
        isAuthenticated: true,
      };
    }
  } catch {}
  return {};
}

function loadAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("auth_access_token");
  } catch {
    return null;
  }
}

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    token: tokenReducer,
  },
  preloadedState: {
    auth: {
      user: null,
      isAuthenticated: false,
      refreshToken: null,
      ...loadAuthFromStorage(),
    },
    token: {
      accessToken: loadAccessTokenFromStorage(),
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

// ── Persist auth/token changes back to localStorage ────────────────────────
let prevAuth = store.getState().auth;
let prevToken = store.getState().token;

store.subscribe(() => {
  const { auth, token } = store.getState();

  // Persist auth state changes
  if (auth !== prevAuth) {
    prevAuth = auth;
    if (auth.isAuthenticated && auth.user && auth.refreshToken) {
      localStorage.setItem("auth_user", JSON.stringify(auth.user));
      localStorage.setItem("auth_refresh_token", auth.refreshToken);
    } else {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_refresh_token");
    }
  }

  // Persist access token changes
  if (token !== prevToken) {
    prevToken = token;
    if (token.accessToken) {
      localStorage.setItem("auth_access_token", token.accessToken);
    } else {
      localStorage.removeItem("auth_access_token");
    }
  }
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
