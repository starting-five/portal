import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthUserState {
  user: AuthUser | null;
}

const initialState: AuthUserState = {
  user: null,
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    clearAuthUser(state) {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
