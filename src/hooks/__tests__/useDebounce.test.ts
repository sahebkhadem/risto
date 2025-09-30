import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
	jest.useFakeTimers();

	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial value", 500));
		expect(result.current).toBe("initial value");
	});

	it("debounces value changes", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 500 } }
		);

		// Change the value
		rerender({ value: "changed", delay: 500 });
		expect(result.current).toBe("initial"); // Still initial

		// Fast forward time
		act(() => {
			jest.advanceTimersByTime(500);
		});
		expect(result.current).toBe("changed");
	});

	// New test cases
	it("handles multiple rapid changes", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 500 } }
		);

		// Multiple rapid changes
		rerender({ value: "change1", delay: 500 });
		act(() => jest.advanceTimersByTime(200));

		rerender({ value: "change2", delay: 500 });
		act(() => jest.advanceTimersByTime(200));

		rerender({ value: "change3", delay: 500 });
		expect(result.current).toBe("initial"); // Still initial

		// After full delay
		act(() => jest.advanceTimersByTime(500));
		expect(result.current).toBe("change3");
	});

	it("works with different delay values", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 200 } }
		);

		rerender({ value: "changed", delay: 200 });
		act(() => jest.advanceTimersByTime(200));
		expect(result.current).toBe("changed");
	});

	afterEach(() => {
		jest.clearAllTimers();
	});
});
