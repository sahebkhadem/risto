import { Anime } from "@/types/Anime";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

// Zustand store for managing anime state
export type ListCategories =
	| "all"
	| "watching"
	| "planning"
	| "completed"
	| "dropped";

export type CategoryList = {
	items: Anime[];
	page: number;
	hasMore: boolean;
	isLoading: boolean;
};

type AnimeState = {
	selectedAnime: number | null;
	setSelectedAnime: (value: number | null) => void;
	lists: Record<ListCategories, CategoryList>;
	fetchList: (
		category: ListCategories,
		page?: number,
		refresh?: boolean
	) => Promise<void>;
	clearLists: () => void;
	addToList: (category: ListCategories, newAnime: Anime) => void;
	removeFromList: (category: ListCategories, animeId: string) => void;
};

const emptyCategory = {
	items: [],
	page: 1,
	hasMore: true,
	isLoading: false
};

// Create the Zustand store with initial state and actions
export const useAnimeStore = create<AnimeState>((set, get) => ({
	selectedAnime: null,
	setSelectedAnime: (value: number | null) => set({ selectedAnime: value }),
	lists: {
		all: { ...emptyCategory },
		watching: { ...emptyCategory },
		planning: { ...emptyCategory },
		completed: { ...emptyCategory },
		dropped: { ...emptyCategory }
	},

	// Fetches a list of anime for a given category (watching, planning, etc.)
	// and updates the Zustand store with the fetched data.
	fetchList: async (category, page, refresh = false) => {
		// Get the current state of the list we're fetching for
		const current = get().lists[category];

		// Check if we're signed in
		const isSignedIn = useAuthStore.getState().user !== null;

		if (!isSignedIn) return;

		// If we're already loading or there's no more pages to fetch, return early
		if (current.isLoading || (!current.hasMore && !refresh)) return;

		// Set the loading state to true for this list
		set((state) => ({
			lists: {
				...state.lists,
				[category]: { ...state.lists[category], isLoading: true }
			}
		}));

		try {
			// Determine the page number to fetch. If refreshing, start at page 1.
			const targetPage = refresh ? 1 : (page ?? current.page);

			// Fetch the data from the server
			const res = await fetch(
				`/api/user/anime?status=${category}&page=${targetPage}&limit=18`
			);

			if (!res.ok) {
				throw new Error(`Fetch failed (${res.status})`);
			}

			const data: { anime: Anime[]; hasMore: boolean } = await res.json();

			// Update the Zustand store with the fetched data
			set((state) => {
				const prev = state.lists[category];

				// If refreshing, replace the items. Otherwise, append them.
				const newItems = refresh ? data.anime : [...prev.items, ...data.anime];

				return {
					lists: {
						...state.lists,
						[category]: {
							items: newItems,
							page: targetPage + 1,
							hasMore: Boolean(data.hasMore),
							isLoading: false
						}
					}
				};
			});
		} catch (error) {
			set({
				lists: {
					...get().lists,
					[category]: { ...current, isLoading: false }
				}
			});
		}
	},

	// Clear all lists
	clearLists: () => {
		set({
			lists: {
				all: { ...emptyCategory },
				watching: { ...emptyCategory },
				planning: { ...emptyCategory },
				completed: { ...emptyCategory },
				dropped: { ...emptyCategory }
			}
		});
	},

	// Add anime to a specified list category
	addToList: (category, newAnime) =>
		set((state) => {
			const updatedState = {
				...state,
				lists: {
					...state.lists,
					[category]: {
						...state.lists[category],
						items: [...state.lists[category].items, newAnime]
					}
				}
			};
			return updatedState;
		}),

	removeFromList: (category, animeId) =>
		set((state) => ({
			lists: {
				...state.lists,
				[category]: {
					...state.lists[category],
					items: state.lists[category].items.filter((a) => a.id !== animeId)
				}
			}
		}))
}));
