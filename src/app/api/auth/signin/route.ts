import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { COOKIE_NAME, createSession } from "@/lib/session";
import { z } from "zod";

const signInSchema = z.object({
	email: z
		.string()
		.email("Invalid email address.")
		.min(1, "Invalid email address."),
	password: z.string().min(8, "Password must be at least 8 characters long.")
});

// Sign In route
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password } = signInSchema.parse(body);

		// Find the user by email
		const user = await prisma.user.findUnique({
			where: { email }
		});

		// Check if user exists
		if (!user) {
			return NextResponse.json(
				{ errors: [{ field: "email", error: "Incorrect email." }] },
				{ status: 404 }
			);
		}

		// Compare the password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ errors: [{ field: "password", error: "Incorrect password." }] },
				{ status: 401 }
			);
		}

		// Create a session for the user
		const { raw, expiresAt } = await createSession(user.id);

		// Set the session token in a cookie and return a response
		const res = NextResponse.json({ user: user.id }, { status: 200 });

		res.cookies.set(COOKIE_NAME, raw, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			expires: expiresAt
		});

		return res;
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
