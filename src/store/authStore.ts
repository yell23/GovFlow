import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthState {
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers[0], // Default: Employee
  login: (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    set({ currentUser: user });
  },
  logout: () => set({ currentUser: null }),
}));
