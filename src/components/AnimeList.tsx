"use client";

import { ListCategories, useAnimeStore } from "@/store/useAnimeStore";
import { useEffect, useRef } from "react";
import AnimeCard from "@/components/AnimeCard";
import Spinner from "@/components/ui/Spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { ListStatusClient } from "@/types/ListStatus";

type AnimeListProps = {
	category: ListCategories;
};

const AnimeList: React.FC<AnimeListProps> = ({ category }) => {
	const isSignedIn = useAuthStore((state) => state.user !== null);
	const { lists, fetchList } = useAnimeStore();

	// Type assertion for category
	const list = lists[category as keyof typeof lists];

	const observerRef = useRef<HTMLDivElement | null>(null);

	// Set up Intersection Observer for infinite scroll
	useEffect(() => {
		if (!isSignedIn) return;
		if (!list.hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !list.isLoading) {
					fetchList(category);
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

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [isSignedIn, list.hasMore, list.isLoading, category, fetchList]);

	if (!isSignedIn) {
		return (
			<h2 className="col-span-6 text-center text-muted-foreground">
				Sign in to see your anime list.
			</h2>
		);
	}

	// Full-screen spinner for initial load (when empty and loading)
	if (list.isLoading && list.items.length === 0) {
		return (
			<div className="flex justify-center items-center py-8 w-full">
				<Spinner size={8} />
			</div>
		);
	}

	return (
		<div className="w-full xs:w-1/2 sm:w-full grid grid-cols-6 gap-4">
			{list.items.length > 0 ? (
				list.items.map((anime, idx) => (
					<AnimeCard
						key={anime.id ?? idx}
						animeId={anime.id}
						malId={anime.malId}
						imageUrl={anime.imageUrl}
						title={anime.title}
						status={anime.listStatus.toLowerCase() as ListStatusClient}
						episodes={anime.episodes}
						episodesWatched={anime.episodesWatched}
					/>
				))
			) : (
				<h2 className="col-span-6 text-center text-muted-foreground">
					Nothing to see here.
				</h2>
			)}

			{list.hasMore && (
				<div ref={observerRef} className="col-span-6 flex justify-center p-8">
					<Spinner size={8} />
				</div>
			)}
		</div>
	);
};

export default AnimeList;
