"use client";

// React
import { useState, ChangeEvent, FC, useEffect, useRef } from "react";

// Components
import { Input } from "../ui/input";
import SearchResultItem from "./SearchResultItem";
import Spinner from "../ui/Spinner";

// Hooks
import { useDebounce } from "@/hooks/useDebounce";

// Type definitions
type AnimeSearchResult = {
	malId: number;
	title: string;
	imageUrl: string;
};

const SearchBox: FC = () => {
	// State for the search query input
	const [query, setQuery] = useState("");
	// Debounced version of the query to limit API calls
	const debouncedQuery = useDebounce(query, 500);

	// State for fetched anime results
	const [results, setResults] = useState<any[]>([]);
	// Loading state for initial fetch
	const [isLoading, setIsLoading] = useState(false);
	// Current page for pagination
	const [currentPage, setCurrentPage] = useState(1);
	// Whether there is a next page available
	const [hasNextPage, setHasNextPage] = useState(false);

	// Ref for the component container (used to hide results when not focused)
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Ref for the intersection observer (used for infinite scroll)
	const observerRef = useRef<HTMLDivElement | null>(null);

	// Handle input changes and update the query state
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
	};

	// Simplify the results for rendering
	const simplifiedResults: AnimeSearchResult[] = results.map((anime) => ({
		malId: anime.mal_id,
		title: anime.title,
		imageUrl:
			anime.images?.jpg?.image_url || anime.images?.webp?.image_url || ""
	}));

	// Clear results when a result item is clicked
	const clearOnResultClick = () => {
		setQuery(""); // Clear query
		setResults([]); // Clear results
	};

	// Reset results and pagination when the debounced query changes
	useEffect(() => {
		if (!debouncedQuery) return;

		setResults([]);
		setCurrentPage(1);
		setHasNextPage(false);
	}, [debouncedQuery]);

	// Fetch anime data from the API when the debounced query or page changes
	useEffect(() => {
		if (!debouncedQuery) return;

		const fetchAnime = async () => {
			// Set loading state based on whether it's the first page or loading more
			if (currentPage === 1) {
				setIsLoading(true);
			}

			try {
				const res = await fetch(
					`https://api.jikan.moe/v4/anime?q=${debouncedQuery}&page=${currentPage}&limit=10`
				);
				const data = await res.json();

				// Set results: replace if first page, append if loading more
				if (currentPage === 1) {
					setResults(data.data);
				} else {
					setResults((prev) => [...prev, ...data.data]);
				}

				// Update pagination state
				setHasNextPage(data.pagination.has_next_page);
			} catch (err) {
				console.error("Error fetching anime:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnime();
	}, [debouncedQuery, currentPage]);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		if (!hasNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// If the sentinel is visible and not already loading, fetch next page
				if (entries[0].isIntersecting) {
					if (!isLoading) {
						setCurrentPage((prev) => prev + 1);
					}
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 1.0
			}
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		// Cleanup observer on unmount or dependency change
		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [hasNextPage, isLoading]);

	// Handle clicks outside the search box to hide results
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setQuery(""); // Clear query
				setResults([]); // Clear results
				setCurrentPage(1); // Reset pagination
				setHasNextPage(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={containerRef} className="relative w-full max-w-md mx-auto mb-8">
			{/* Search input box */}
			<Input
				onChange={handleChange}
				placeholder="Enter anime title..."
				value={query}
			/>
			{query && (
				<div
					className="absolute top-full left-0 z-50 w-full mt-4 rounded-md border bg-background overflow-y-auto custom-scroll pl-3 py-3"
					style={{ maxHeight: "calc(100vh - 400px)" }}
				>
					{isLoading ? (
						// Show spinner while loading initial results
						<div className="flex justify-center items-center py-8">
							<Spinner size={8} />
						</div>
					) : (
						<div className="flex flex-col justify-center items-center">
							{/* Render search results */}
							{simplifiedResults.map((anime) => (
								<SearchResultItem
									key={anime.malId}
									malId={anime.malId}
									title={anime.title}
									imageUrl={anime.imageUrl}
									clearResults={clearOnResultClick}
								/>
							))}

							{/* Sentinel for infinite scroll, shows spinner when loading more */}
							{hasNextPage && (
								<div ref={observerRef} className="p-8">
									<Spinner size={8} />
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchBox;
