"use client";

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/src/services/api/apiTypes";

type UserRole = "USER" | "ADMIN";

interface TokenPayload {
  role?: UserRole;
  exp?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userProfile: User | null;
  setAuthFromToken: (token: string | null) => void;
  setUserProfile: (profile: User | null) => void;
  clearAuth: () => void;
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return null;
  const cookieValue = parts.pop()?.split(";").shift() || null;
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

const resolveRoleFromToken = (token: string | null): UserRole | null => {
  if (!token) return null;
  try {
    const payload = jwtDecode<TokenPayload>(token);
    return payload.role || "USER";
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  // Keep initial state deterministic for SSR/CSR hydration.
  isAuthenticated: false,
  userRole: null,
  userProfile: null,

  setAuthFromToken: (token) =>
    set({
      isAuthenticated: !!token,
      userRole: resolveRoleFromToken(token),
    }),

  setUserProfile: (profile) => set({ userProfile: profile }),

  clearAuth: () =>
    set({
      isAuthenticated: false,
      userRole: null,
      userProfile: null,
    }),
}));
