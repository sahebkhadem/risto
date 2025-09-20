import { create } from "zustand";

// Zustand store for managing authentication state
type AuthState = {
	isSessionValidating: boolean;
	setIsValidatingSession: (value: boolean) => void;
	user: string | null;
	setUser: (value: string | null) => void;
	isSigningOut: boolean;
	setIsSigningOut: (value: boolean) => void;
};

// Create the Zustand store with initial state and actions
export const useAuthStore = create<AuthState>((set) => ({
	isSessionValidating: true,
	setIsValidatingSession: (value) => set({ isSessionValidating: value }),
	user: null,
	setUser: (value) => set({ user: value }),
	isSigningOut: false,
	setIsSigningOut: (value) => set({ isSigningOut: value })
}));
