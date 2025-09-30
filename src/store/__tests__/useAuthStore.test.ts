import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "@/store/useAuthStore";

describe("useAuthStore", () => {
	// Reset store before each test
	beforeEach(() => {
		useAuthStore.setState({
			isSessionValidating: true,
			user: null,
			isSigningOut: false
		});
	});

	it("should initialize with default values", () => {
		const { result } = renderHook(() => useAuthStore());

		expect(result.current.isSessionValidating).toBe(true);
		expect(result.current.user).toBeNull();
		expect(result.current.isSigningOut).toBe(false);
	});

	it("should update session validation state", () => {
		const { result } = renderHook(() => useAuthStore());

		act(() => {
			result.current.setIsValidatingSession(false);
		});

		expect(result.current.isSessionValidating).toBe(false);
	});

	it("should update user state", () => {
		const { result } = renderHook(() => useAuthStore());

		act(() => {
			result.current.setUser("abc123");
		});

		expect(result.current.user).toBe("abc123");
	});

	it("should update signing out state", () => {
		const { result } = renderHook(() => useAuthStore());

		act(() => {
			result.current.setIsSigningOut(true);
		});

		expect(result.current.isSigningOut).toBe(true);
	});
});
