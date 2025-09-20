import { createHash } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { COOKIE_NAME, getAuthenticatedUser } from "@/lib/session";

// Handles GET requests to check if the session is valid
export async function GET(req: NextRequest) {
	try {
		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		// If session is valid, return success message
		return NextResponse.json({ user: user.id }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Handles DELETE requests to clear the session
export async function DELETE(req: NextRequest) {
	try {
		// Retrieve the raw session token from cookies
		const session_token = req.cookies.get(COOKIE_NAME)?.value;

		if (!session_token) {
			return NextResponse.json({ error: "No session found" }, { status: 401 });
		}

		// Delete the session from the database
		const hashedToken = createHash("sha256")
			.update(session_token)
			.digest("hex");
		await prisma.$transaction([
			prisma.session.deleteMany({
				where: { token: hashedToken }
			})
		]);

		// Clear the session cookie by setting it to expire immediately
		const response = NextResponse.json({}, { status: 200 });
		response.cookies.delete(COOKIE_NAME);

		return response;
	} catch (error) {
		console.error("Session check error:", error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
