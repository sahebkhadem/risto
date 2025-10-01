"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription
} from "@/components/ui/dialog";
import { useAnimeStore } from "@/store/useAnimeStore";
import { DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import AnimeMetadata from "./AnimeMetadata";
import AnimeForm from "@/components/AnimeForm";
import { useAuthStore } from "@/store/useAuthStore";
import AuthDialog from "../auth-dialog/AuthDialog";
import { LoadingButton } from "../ui/LoadingButton";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { ListStatusClient, toClientStatus } from "@/types/ListStatus";

type AnimeData = {
	id: string | null;
	malId: number; // MyAnimeList ID
	title: string;
	imageUrl: string;
	listStatus: ListStatusClient | null;
	type: string; // TV, Movie, OVA, ONA, Music Video, etc.
	source: string; // Manga, Light Novel, Original, etc.
	episodes: number;
	malScore: number; // Anime's score on MyAnimeList
	status: string; // e.g., "Finished Airing", "Currently Airing"
	episodesWatched: number; // Number of episodes watched by the user
	year: number; // Year the anime was released
	season: "Winter" | "Spring" | "Summer" | "Fall";
	aired: string; // e.g., "Apr 3, 2021 to Jun 26, 2021"
	duration: string; // e.g., "24 min per ep"
	synopsis: string;
	studios: string[];
	genres: string[];
	themes: string[];
	demographics: string[];
};
const AnimeDialog: React.FC = () => {
	const isSignedIn = useAuthStore((state) => state.user !== null);
	const [isLoading, setIsLoading] = useState(false);
	const [animeData, setAnimeData] = useState<AnimeData>();
	const selectedAnime = useAnimeStore((state) => state.selectedAnime);
	const [hasAnime, setHasAnime] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const normalizeAnimeData = async (data: any) => {
		const id = null;
		let listStatus = null;
		let episodesWatched = 0;

		try {
			const res = await fetch(`/api/user/anime/${data.mal_id}`);
			const userAnimeData: {
				listStatus: ListStatusClient;
				episodesWatched: number;
			} = await res.json();

			if (userAnimeData.listStatus) {
				listStatus = userAnimeData.listStatus;
				episodesWatched = userAnimeData.episodesWatched;
				setHasAnime(true);
			} else {
				setHasAnime(false);
			}
		} catch (error) {
			console.log(error);
			toast.error("Sorry, something went wrong.");
		}

		const normalizedData = {
			id,
			malId: data.mal_id,
			title: data.title,
			imageUrl: data.images.jpg.image_url,
			listStatus,
			type: data.type,
			source: data.source,
			episodes: data.episodes,
			malScore: data.score,
			status: data.status,
			episodesWatched,
			year: data.year,
			season: data.season,
			aired: data.aired.string,
			duration: data.duration,
			synopsis: data.synopsis,
			studios: data.studios.map(
				(studio: { mal_id: number; type: string; name: string; url: string }) =>
					studio.name
			),
			genres: data.genres.map(
				(genre: { mal_id: number; type: string; name: string; url: string }) =>
					genre.name
			),
			themes: data.themes.map(
				(theme: { mal_id: number; type: string; name: string; url: string }) =>
					theme.name
			),
			demographics: data.demographics.map(
				(demo: { mal_id: number; type: string; name: string; url: string }) =>
					demo.name
			)
		};

		return normalizedData;
	};

	const handleAddToList = async () => {
		setIsAdding(true);

		try {
			const newAnimeData = {
				...animeData,
				listStatus: "watching" as ListStatusClient
			};

			const res = await fetch("/api/user/anime", {
				method: "POST",
				body: JSON.stringify(newAnimeData),
				headers: { "Content-Type": "application/json" }
			});

			if (!res.ok) {
				const data = await res.json();
				console.log(data);
			}

			const { newAnime } = await res.json();
			setAnimeData({
				...newAnime,
				listStatus: toClientStatus(newAnime.listStatus)
			});

			useAnimeStore
				.getState()
				.addToList(toClientStatus(newAnime.listStatus), newAnime);
			setIsAdding(false);
			setHasAnime(true);
		} catch (error) {
			console.log(error);
			setIsAdding(false);
			toast.error("Something went wrong. Please try again.");
		}
	};

	useEffect(() => {
		const fetchAnime = async () => {
			if (!selectedAnime) return;

			try {
				setIsLoading(true);

				const res = await fetch(
					`https://api.jikan.moe/v4/anime/${selectedAnime}`
				);
				const data = await res.json();
				const normalizedData = await normalizeAnimeData(data.data);
				setAnimeData(normalizedData);
			} catch (err) {
				console.error("Error fetching anime:", err);
			} finally {
				setIsLoading(false);
			}
		};

		if (selectedAnime) {
			fetchAnime();
		}
	}, [selectedAnime]);

	return (
		<Dialog
			open={!!selectedAnime}
			onOpenChange={(open) => {
				if (!open) useAnimeStore.getState().setSelectedAnime(null);
			}}
		>
			{animeData && (
				<DialogContent className="lg:max-w-3/4 md:max-w-3/4 sm:d:max-w-1/2 w-full max-h-11/12 overflow-y-auto custom-scroll">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<Spinner size={12} />
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<DialogTitle className="font-bold text-xl h-fit fixed">
								{animeData.title}
							</DialogTitle>

							<div className="mt-12 flex flex-col sm:flex-row gap-8">
								<div className="flex flex-col gap-4 h-full">
									<div className="flex items-center justify-center sm:justify-start">
										<Image
											src={animeData.imageUrl}
											width={150}
											height={250}
											alt={animeData.title}
											className="rounded-md"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<AnimeMetadata name="Type" value={animeData.type} />
										<AnimeMetadata name="Episodes" value={animeData.episodes} />
										<AnimeMetadata name="Status" value={animeData.status} />
										<AnimeMetadata name="Aired" value={animeData.aired} />
										<AnimeMetadata name="Studios" value={animeData.studios} />
										<AnimeMetadata name="Genres" value={animeData.genres} />
										<AnimeMetadata name="Themes" value={animeData.themes} />
										<AnimeMetadata name="Duration" value={animeData.duration} />
									</div>
								</div>
								<div className="flex flex-col gap-8 flex-1">
									{!isSignedIn ? (
										<AuthDialog />
									) : !hasAnime ? (
										<LoadingButton
											className="self-start"
											type="button"
											isLoading={isAdding}
											clickHandler={handleAddToList}
										>
											<CirclePlus />
											Add to list
										</LoadingButton>
									) : (
										animeData.listStatus && (
											<AnimeForm
												animeId={animeData.id}
												listStatus={animeData.listStatus}
												episodes={animeData.episodes}
												episodesWatched={animeData.episodesWatched}
											/>
										)
									)}
									<DialogDescription className="text-justify flex-1">
										{animeData.synopsis}
									</DialogDescription>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			)}
		</Dialog>
	);
};

export default AnimeDialog;
