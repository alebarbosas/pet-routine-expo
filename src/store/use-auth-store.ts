import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  sessionToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setSession: (sessionToken: string, user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      sessionToken: null,
      user: null,
      isHydrated: false,

      setSession: (sessionToken, user) =>
        set({ sessionToken, user }),

      clearSession: () =>
        set({ sessionToken: null, user: null }),

      setHydrated: (isHydrated) =>
        set({ isHydrated }),
    }),
    {
      name: '@petroutine:auth-session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessionToken: state.sessionToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        } else {
          useAuthStore.setState({ isHydrated: true });
        }
      },
    }
  )
);