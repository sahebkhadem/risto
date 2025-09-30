import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnimeStore } from "@/store/useAnimeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Anime } from "@/types/Anime";

// Mock global fetch to control API responses in tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock anime object
const mockAnime: Anime = {
	id: "1",
	title: "Test Anime",
	userId: "user1",
	malId: 1001,
	imageUrl: "https://example.com/image.jpg",
	listStatus: "Watching",
	episodes: 12,
	episodesWatched: 0,
	type: "TV",
	status: "airing",
	synopsis: "A test synopsis",
	genres: ["Action"],
	studios: ["Studio Test"],
	season: "Winter",
	year: 2024,
	source: "Manga",
	malScore: 8.5,
	aired: "2024-01-01",
	duration: "24 min per ep",
	themes: [],
	demographics: []
};

// Mock array of anime for list fetching tests
const mockAnimeArray: Anime[] = [
	{
		id: "1",
		title: "Test Anime",
		userId: "user1",
		malId: 1001,
		imageUrl: "https://example.com/image.jpg",
		listStatus: "Watching",
		episodes: 12,
		episodesWatched: 0,
		type: "TV",
		status: "airing",
		synopsis: "A test synopsis",
		genres: ["Action"],
		studios: ["Studio Test"],
		season: "Winter",
		year: 2024,
		source: "Manga",
		malScore: 8.5,
		aired: "2024-01-01",
		duration: "24 min per ep",
		themes: [],
		demographics: []
	},
	{
		id: "2",
		title: "Another Anime",
		userId: "user2",
		malId: 1002,
		imageUrl: "https://example.com/image2.jpg",
		listStatus: "Completed",
		episodes: 24,
		episodesWatched: 24,
		type: "Movie",
		status: "finished",
		synopsis: "Another test synopsis",
		genres: ["Adventure"],
		studios: ["Studio Another"],
		season: "Spring",
		year: 2023,
		source: "Original",
		malScore: 9.0,
		aired: "2023-04-01",
		duration: "120 min",
		themes: [],
		demographics: []
	}
];

describe("useAnimeStore", () => {
	// Reset stores and clear mocks before each test
	beforeEach(() => {
		// Reset anime store
		useAnimeStore.setState({
			selectedAnime: null,
			lists: {
				all: { items: [], page: 1, hasMore: true, isLoading: false },
				watching: { items: [], page: 1, hasMore: true, isLoading: false },
				planning: { items: [], page: 1, hasMore: true, isLoading: false },
				completed: { items: [], page: 1, hasMore: true, isLoading: false },
				dropped: { items: [], page: 1, hasMore: true, isLoading: false }
			}
		});

		// Reset auth store (because fetchList depends on it)
		useAuthStore.setState({
			isSessionValidating: true,
			user: null, // Default to not signed in
			isSigningOut: false
		});

		// Clear any previous mock calls
		mockFetch.mockClear();
	});

	it("should initialize with default values", () => {
		const { result } = renderHook(() => useAnimeStore());

		expect(result.current.selectedAnime).toBeNull();
		expect(result.current.lists).toEqual({
			all: { items: [], page: 1, hasMore: true, isLoading: false },
			watching: { items: [], page: 1, hasMore: true, isLoading: false },
			planning: { items: [], page: 1, hasMore: true, isLoading: false },
			completed: { items: [], page: 1, hasMore: true, isLoading: false },
			dropped: { items: [], page: 1, hasMore: true, isLoading: false }
		});
	});

	it("should update selectedAnime state", () => {
		const { result } = renderHook(() => useAnimeStore());

		// Test setting a specific anime ID
		act(() => {
			result.current.setSelectedAnime(123);
		});
		expect(result.current.selectedAnime).toBe(123);

		// Test clearing the selection
		act(() => {
			result.current.setSelectedAnime(null);
		});
		expect(result.current.selectedAnime).toBeNull();
	});

	it("should add anime to a specified category list", () => {
		const { result } = renderHook(() => useAnimeStore());

		// Add anime to the "watching" category
		act(() => {
			result.current.addToList("watching", mockAnime);
		});

		// Assert the anime was added to "watching"
		expect(result.current.lists.watching.items).toEqual([mockAnime]);
		expect(result.current.lists.watching.page).toBe(1);
		expect(result.current.lists.watching.hasMore).toBe(true);
		expect(result.current.lists.watching.isLoading).toBe(false);

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);
	});

	it("should remove anime from a specified category list", () => {
		const { result } = renderHook(() => useAnimeStore());

		// First, add anime to the "watching" category
		act(() => {
			result.current.addToList("watching", mockAnime);
		});

		// Remove the anime from "watching"
		act(() => {
			result.current.removeFromList("watching", "1");
		});

		// Assert the anime was removed from "watching"
		expect(result.current.lists.watching.items).toEqual([]);
		expect(result.current.lists.watching.page).toBe(1);
		expect(result.current.lists.watching.hasMore).toBe(true);
		expect(result.current.lists.watching.isLoading).toBe(false);

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);
	});

	it("should clear all category lists", () => {
		const { result } = renderHook(() => useAnimeStore());

		// Set selectedAnime and add anime to "watching" to simulate a populated state
		act(() => {
			result.current.setSelectedAnime(123);
			result.current.addToList("watching", mockAnime);
		});

		// Call clearLists
		act(() => {
			result.current.clearLists();
		});

		// Assert all category lists are reset to initial state
		expect(result.current.lists).toEqual({
			all: { items: [], page: 1, hasMore: true, isLoading: false },
			watching: { items: [], page: 1, hasMore: true, isLoading: false },
			planning: { items: [], page: 1, hasMore: true, isLoading: false },
			completed: { items: [], page: 1, hasMore: true, isLoading: false },
			dropped: { items: [], page: 1, hasMore: true, isLoading: false }
		});

		// Assert selectedAnime is unchanged
		expect(result.current.selectedAnime).toBe(123);
	});

	it("should fetch and update anime list for a category when signed in", async () => {
		const { result } = renderHook(() => useAnimeStore());

		// Mock a signed-in user
		act(() => {
			useAuthStore.setState({ user: "test@example.com" });
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ anime: mockAnimeArray, hasMore: true })
		});

		// Call fetchList
		await act(async () => {
			await result.current.fetchList("watching");
		});

		// Assert the watching list was updated
		await waitFor(() => {
			expect(result.current.lists.watching.items).toEqual(mockAnimeArray);
			expect(result.current.lists.watching.page).toBe(2);
			expect(result.current.lists.watching.hasMore).toBe(true);
			expect(result.current.lists.watching.isLoading).toBe(false);
		});

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);

		// Assert fetch was called with correct URL
		expect(mockFetch).toHaveBeenCalledWith(
			"/api/user/anime?status=watching&page=1&limit=18"
		);
	});

	it("should not fetch or update list when not signed in", async () => {
		const { result } = renderHook(() => useAnimeStore());

		// Ensure user is not signed in (default from beforeEach)
		expect(useAuthStore.getState().user).toBeNull();

		// Call fetchList
		await act(async () => {
			await result.current.fetchList("watching");
		});

		// Assert the watching list is unchanged
		expect(result.current.lists.watching).toEqual({
			items: [],
			page: 1,
			hasMore: true,
			isLoading: false
		});

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);

		// Assert fetch was not called
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("should handle fetch error and reset loading state", async () => {
		const { result } = renderHook(() => useAnimeStore());

		// Mock a signed-in user
		act(() => {
			useAuthStore.setState({ user: "test@example.com" });
		});

		// Mock API error response
		mockFetch.mockRejectedValueOnce(new Error("Fetch failed (500)"));

		// Call fetchList
		await act(async () => {
			await result.current.fetchList("watching");
		});

		// Assert the watching list is unchanged except for loading
		await waitFor(() => {
			expect(result.current.lists.watching).toEqual({
				items: [],
				page: 1,
				hasMore: true,
				isLoading: false
			});
		});

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);

		// Assert fetch was called with correct URL
		expect(mockFetch).toHaveBeenCalledWith(
			"/api/user/anime?status=watching&page=1&limit=18"
		);
	});

	it("should refresh anime list for a category when signed in", async () => {
		const { result } = renderHook(() => useAnimeStore());

		// Mock a signed-in user
		act(() => {
			useAuthStore.setState({ user: "test@example.com" });
		});

		// Populate watching list with initial data
		const initialAnime: Anime = { ...mockAnime, id: "initial" };
		act(() => {
			result.current.addToList("watching", initialAnime);
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ anime: mockAnimeArray, hasMore: false })
		});

		// Call fetchList with refresh: true
		await act(async () => {
			await result.current.fetchList("watching", undefined, true);
		});

		// Assert the watching list was refreshed
		await waitFor(() => {
			expect(result.current.lists.watching.items).toEqual(mockAnimeArray);
			expect(result.current.lists.watching.page).toBe(2);
			expect(result.current.lists.watching.hasMore).toBe(false);
			expect(result.current.lists.watching.isLoading).toBe(false);
		});

		// Assert other categories are unchanged
		expect(result.current.lists.all.items).toEqual([]);
		expect(result.current.lists.planning.items).toEqual([]);
		expect(result.current.lists.completed.items).toEqual([]);
		expect(result.current.lists.dropped.items).toEqual([]);

		// Assert fetch was called with correct URL
		expect(mockFetch).toHaveBeenCalledWith(
			"/api/user/anime?status=watching&page=1&limit=18"
		);
	});
});
