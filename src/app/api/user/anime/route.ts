import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/session";
import { ListStatus } from "@/generated/prisma";
import {
	listStatusValues,
	ListStatusClient,
	toPrismaStatus
} from "@/types/ListStatus";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Retrieve user's anime list
export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const status = url.searchParams.get("status") ?? "all";
		const page = parseInt(url.searchParams.get("page") ?? "1", 10);
		const limit = parseInt(url.searchParams.get("limit") ?? "18", 10);

		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		let where: { userId: string; listStatus?: ListStatus } = {
			userId: user.id
		};
		if (status !== "all") {
			where = {
				...where,
				listStatus: toPrismaStatus(status as ListStatusClient)
			};
		}

		// Fetch with pagination: take one extra to check hasMore
		const take = limit + 1;
		const skip = (page - 1) * limit;
		const anime = await prisma.anime.findMany({
			where,
			take,
			skip,
			orderBy: { updatedAt: "desc" }
		});

		const hasMore = anime.length > limit;

		// Return the user's anime list (slice if hasMore)
		return NextResponse.json(
			{ anime: hasMore ? anime.slice(0, -1) : anime, hasMore },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

const animeSchema = z.object({
	id: z.string().nullable(),
	malId: z.number(),
	title: z.string(),
	imageUrl: z.string(),
	listStatus: z.enum(listStatusValues),
	type: z.string(),
	source: z.string(),
	episodes: z.number(),
	malScore: z.number(),
	status: z.string(),
	episodesWatched: z.number(),
	year: z.number(),
	season: z.string(),
	aired: z.string(),
	duration: z.string(),
	synopsis: z.string(),
	studios: z.array(z.string()),
	genres: z.array(z.string()),
	themes: z.array(z.string()),
	demographics: z.array(z.string())
});

// Add anime to user's list
export async function POST(req: NextRequest) {
	try {
		// Parse the request body as JSON
		const body = await req.json();
		const animeData = animeSchema.parse(body);

		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		// Remove 'id' from animeData before saving to DB
		const { id: _id, ...cleanAnimeData } = animeData;

		// Add anime to database
		const newAnime = await prisma.anime.create({
			data: {
				...cleanAnimeData,
				user: { connect: { id: user.id } },
				listStatus: ListStatus.WATCHING
			}
		});

		return NextResponse.json({ newAnime });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid anime data", details: err.errors },
				{ status: 400 }
			);
		}
		console.log(err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
