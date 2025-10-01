"use client";

import { toast } from "sonner";
import EpisodeCounter from "@/components/ui/EpisodeCounter";
import { LoadingButton } from "@/components/ui/LoadingButton";
import StatusSelector from "@/components/ui/StatusSelector";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { ListStatusClient, listStatusValues } from "@/types/ListStatus";
import { useEffect } from "react";
import { useAnimeStore } from "@/store/useAnimeStore";

type AnimeFormProps = {
	animeId: string | null;
	formLayout?: "row" | "col";
	listStatus: ListStatusClient;
	episodesWatched: number;
	episodes: number;
};

const animeFormSchema = z.object({
	status: z.enum(listStatusValues),
	episode: z.number()
});

type AnimeFormSchema = z.infer<typeof animeFormSchema>;

const AnimeForm: React.FC<AnimeFormProps> = ({
	animeId,
	formLayout = "row",
	episodes,
	episodesWatched,
	listStatus
}) => {
	const layoutClasses =
		formLayout === "row"
			? "h-fit min-h-16 flex flex-col sm:flex-row gap-4"
			: "h-full flex flex-col gap-4";

	const form = useForm<AnimeFormSchema>({
		resolver: zodResolver(animeFormSchema),
		defaultValues: {
			status: listStatus,
			episode: episodesWatched
		}
	});

	// Ensure form values update when props change
	useEffect(() => {
		form.reset({
			status: listStatus,
			episode: episodesWatched
		});
	}, [listStatus, episodesWatched, form]);

	const submitHandler = async (data: AnimeFormSchema) => {
		try {
			await fetch(`/api/user/anime/${animeId}`, {
				method: "PATCH",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" }
			});

			// Remove the anime from its old list
			useAnimeStore.getState().removeFromList(listStatus, animeId as string);

			// Fetch and refresh the new list to include the updated anime
			// Pass `true` for the refresh parameter
			useAnimeStore.getState().fetchList(data.status, undefined, true);

			toast.success("Anime updated successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Sorry. Something went wrong.");
		}
	};

	// Update episode field when status is completed
	const status = useWatch({
		control: form.control,
		name: "status"
	});

	useEffect(() => {
		if (status === "completed") {
			form.setValue("episode", episodes, { shouldValidate: true });
		} else {
			form.setValue("episode", episodesWatched, { shouldValidate: true });
		}
	}, [status, episodes, episodesWatched, form]);

	return (
		<form
			onSubmit={form.handleSubmit(submitHandler)}
			onClick={(e) => e.stopPropagation()}
			className={`w-full ${layoutClasses} items-center`}
		>
			<LoadingButton
				variant="default"
				className=""
				isLoading={form.formState.isSubmitting}
				type="submit"
			>
				<span className="text-sm">Update</span>
			</LoadingButton>

			<Controller
				name="status"
				control={form.control}
				render={({ field }) => (
					<StatusSelector
						value={field.value ?? listStatus}
						onChange={field.onChange}
						disabled={form.formState.isSubmitting}
					/>
				)}
			/>

			<Controller
				name="episode"
				control={form.control}
				render={({ field }) => (
					<EpisodeCounter
						episodes={episodes}
						value={field.value}
						onChange={field.onChange}
						disabled={form.formState.isSubmitting || status === "completed"}
					/>
				)}
			/>
		</form>
	);
};

export default AnimeForm;
