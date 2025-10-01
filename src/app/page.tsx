"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBox from "@/components/anime-search/SearchBox";
import { bytesized } from "./fonts";
import AnimeDialog from "@/components/anime-dialog/AnimeDialog";
import { ListCategories, useAnimeStore } from "@/store/useAnimeStore";
import { useEffect, useState } from "react";
import AnimeList from "@/components/AnimeList";

export default function Home() {
	const [activeTab, setActiveTab] = useState<ListCategories>("watching");
	const { lists, fetchList } = useAnimeStore();

	// Handle tab change with type assertion
	const handleTabChange = (value: string) => {
		setActiveTab(value as ListCategories);
	};

	// Fetch initial data when tab changes (if list is empty)
	useEffect(() => {
		const currentList = lists[activeTab as keyof typeof lists];
		if (
			currentList.items.length === 0 &&
			currentList.hasMore &&
			!currentList.isLoading
		) {
			fetchList(activeTab);
		}
	}, [activeTab, fetchList, lists]);

	return (
		<main className="w-full px-8 sm:px-16 md:px-24 lg:px-32 py-8">
			<AnimeDialog />

			<div className="flex flex-col items-center mb-8">
				<h1
					className={`${bytesized.variable} font-logo text-9xl tracking-tighter text-primary cursor-default`}
				>
					Risto
				</h1>
				<span className="text-muted-foreground fontbol">Find new anime!</span>
			</div>

			<SearchBox />

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				defaultValue="watching"
				className="w-full flex gap-8 items-center justify-center"
			>
				<TabsList className="flex-wrap">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="watching">Watching</TabsTrigger>
					<TabsTrigger value="planning">Planning</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
					<TabsTrigger value="dropped">Dropped</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="flex flex-col items-center">
					<AnimeList category="all" />
				</TabsContent>
				<TabsContent value="watching" className="flex flex-col items-center">
					<AnimeList category="watching" />
				</TabsContent>
				<TabsContent value="planning" className="flex flex-col items-center">
					<AnimeList category="planning" />
				</TabsContent>
				<TabsContent value="completed" className="flex flex-col items-center">
					<AnimeList category="completed" />
				</TabsContent>
				<TabsContent value="dropped" className="flex flex-col items-center">
					<AnimeList category="dropped" />
				</TabsContent>
			</Tabs>
		</main>
	);
}
