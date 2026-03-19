import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string | number;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentRole = (state: { auth: AuthState }) => state.auth.user?.role || null;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;

export default authSlice.reducer;
