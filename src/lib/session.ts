import prisma from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "session_token";

export async function createSession(userId: string) {
	// Generate and hash a random token
	const raw = randomBytes(48).toString("hex");
	const hashed = createHash("sha256").update(raw).digest("hex");

	// Generate session expirey date 7 days in the future
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

	// Create a new session in the database
	await prisma.session.create({
		data: {
			userId,
			token: hashed,
			expiresAt
		}
	});

	// Return raw token so the caller (route) can set the cookie
	return { raw, expiresAt };
}

// Helper function to validate session
export async function validateSession(sessionToken: string) {
	// Hash the session token for secure lookup
	const hashedToken = createHash("sha256").update(sessionToken).digest("hex");

	// Find the session in the database using the hashed token
	const session = await prisma.session.findUnique({
		where: { token: hashedToken },
		select: { userId: true, expiresAt: true }
	});

	// Check if session exists and is still valid
	if (session && session.expiresAt > new Date()) {
		return { isSessionValid: true, userId: session.userId };
	}

	return { isSessionValid: false, userId: "" };
}

export async function getAuthenticatedUser(req: NextRequest) {
	const session_token = req.cookies.get(COOKIE_NAME)?.value;

	// If no session token, return unauthorized
	if (!session_token) {
		return {
			user: null,
			error: NextResponse.json({ user: null }, { status: 401 })
		};
	}

	const { isSessionValid, userId } = await validateSession(session_token);

	// If session is invalid, return unauthorized
	if (!isSessionValid) {
		return {
			user: null,
			error: NextResponse.json({ user: null }, { status: 401 })
		};
	}

	const user = await prisma.user.findUnique({ where: { id: userId } });
	// If user does not exist, return unauthorized
	if (!user) {
		return {
			user: null,
			error: NextResponse.json({ user: null }, { status: 401 })
		};
	}

	// If session is valid and user exists, return user
	return { user, error: null };
}
