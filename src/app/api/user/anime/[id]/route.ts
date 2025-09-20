import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/session";
import { ListStatusClient, toPrismaStatus } from "@/types/ListStatus";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get anime list status and episodes watched
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const paramsData = await params;

		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		// Check if anime with the given malId exists in the user's list
		const malId = parseInt(paramsData.id, 10);
		const userAnime = await prisma.anime.findFirst({
			where: {
				malId,
				userId: user.id
			}
		});

		// If anime not found in user's list, return empty list status
		if (!userAnime) {
			return NextResponse.json({ hasAnime: false }, { status: 200 });
		}

		// Return the user's anime list status and episodes watched
		return NextResponse.json(
			{
				id: userAnime.id,
				listStatus: userAnime.listStatus,
				episodesWatched: userAnime.episodesWatched
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

const updateAnimeSchema = z.object({
	status: z.enum(["watching", "planning", "completed", "dropped"]),
	episode: z.number().min(0).optional()
});

// Update anime in user's list
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Get params data
		const paramsData = await params;
		const animeId = paramsData.id;

		// Parse the request body as JSON
		const body = await req.json();
		const { status, episode } = updateAnimeSchema.parse(body);

		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		// Update anime in the database
		const updatedAnime = await prisma.anime.update({
			where: { id: animeId, userId: user.id },
			data: {
				listStatus: toPrismaStatus(status as ListStatusClient),
				episodesWatched: episode
			}
		});

		return NextResponse.json({ updatedAnime });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					errors: error.errors.map((e) => ({
						field: e.path[0],
						error: e.message
					}))
				},
				{ status: 400 }
			);
		}

		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
