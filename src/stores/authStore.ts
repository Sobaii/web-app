import { create } from "zustand";
import { User } from "../types/api";

type AuthState = {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (userData: User) =>
    set(() => ({
      user: userData,
    })),

  // Log out the user
  logout: () =>
    set(() => ({
      user: null,
    })),
}));

export default useAuthStore;
