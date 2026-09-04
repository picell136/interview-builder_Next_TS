import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { storage } from "@/lib/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const sessionId = storage.getSession();
  if (!sessionId) return null;
  const users = storage.getUsers();
  const found = users.find((u) => u.id === sessionId);
  if (!found) return null;
  return { id: found.id, email: found.email, name: found.name };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      storage.clearSession();
    },
    hydrateAuth(state) {
      const user = getInitialUser();
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setUser, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
