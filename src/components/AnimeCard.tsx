"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import AnimeForm from "@/components/AnimeForm";
import { useAnimeStore } from "@/store/useAnimeStore";
import { ListStatusClient } from "@/types/ListStatus";

interface AnimeCardProps {
	animeId: string;
	malId: number;
	imageUrl: string;
	title: string;
	episodes: number;
	episodesWatched: number;
	status: ListStatusClient;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
	animeId,
	malId,
	imageUrl,
	title,
	status,
	episodes,
	episodesWatched
}) => {
	return (
		<Card
			role="button"
			className="p-0 pt-4 sm:pt-0 gap-0 flex-col sm:flex-row justify-center items-center bg-background cursor-pointer transition-colors hover:bg-black/5 hover:border-black/15 dark:hover:bg-white/5 dark:hover:border-white/15 col-span-6 lg:col-span-3 xl:col-span-2"
			onClick={() => useAnimeStore.getState().setSelectedAnime(malId)}
		>
			<Image
				src={imageUrl}
				alt={title}
				width={150}
				height={250}
				className="rounded-md sm:rounded-l-md sm:rounded-r-none"
			/>

			<CardContent className="p-4 flex-1">
				<AnimeForm
					animeId={animeId}
					formLayout="col"
					episodes={episodes}
					listStatus={status}
					episodesWatched={episodesWatched}
				/>
			</CardContent>
		</Card>
	);
};

export default AnimeCard;
