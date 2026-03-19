import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  accessToken: string | null;
}

const initialState: TokenState = {
  accessToken: null, // we don’t need to read from localStorage since accessToken is short-lived
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;