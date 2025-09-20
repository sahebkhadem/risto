import { FC } from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { useAnimeStore } from "@/store/useAnimeStore";

interface SearchResultItemProps {
	malId: number;
	imageUrl: string;
	title: string;
	clearResults: () => void; // Clear results on click
}

const SearchResultItem: FC<SearchResultItemProps> = ({
	malId,
	imageUrl,
	title,
	clearResults
}) => {
	return (
		<Button
			variant="ghost"
			className="w-full flex gap-4 px-4 py-12 justify-start items-center rounded-md"
			onClick={() => {
				useAnimeStore.getState().setSelectedAnime(malId);
				clearResults();
			}}
		>
			<Image
				src={imageUrl}
				alt={title}
				width={50}
				height={100}
				className="rounded-md"
			/>
			<span className="text-left text-sm font-bold truncate">{title}</span>
		</Button>
	);
};

export default SearchResultItem;
