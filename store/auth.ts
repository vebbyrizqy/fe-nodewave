import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  fullName: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
)
