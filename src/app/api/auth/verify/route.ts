import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { COOKIE_NAME, createSession } from "@/lib/session";
import { TokenType } from "@/generated/prisma";

export async function GET(req: NextRequest) {
	try {
		const token = req.nextUrl.searchParams.get("token");

		// Validate the token
		if (!token) {
			return NextResponse.json(
				{ error: "Invalid or missing token" },
				{ status: 400 }
			);
		}
		const record = await prisma.verificationToken.findUnique({
			where: { token },
			include: { user: true }
		});

		// Check if token exists and has not expired
		if (!record || record.expiresAt < new Date()) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 410 }
			);
		}

		if (!record) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 410 }
			);
		}

		// Handle password reset token type
		if (record.type === TokenType.PASSWORD_RESET) {
			// Delete the token
			await prisma.verificationToken.deleteMany({ where: { token } });
			return NextResponse.json(
				{ message: "Token is valid", user: record.userId },
				{ status: 200 }
			);
		}

		// Mark user as verified and delete the token
		await prisma.$transaction([
			prisma.user.update({
				where: { id: record.userId },
				data: { verified: true }
			}),
			prisma.verificationToken.delete({ where: { token } })
		]);

		// Create a session
		const { raw, expiresAt } = await createSession(record.userId);
		const res = NextResponse.json({ user: record.user.id });
		res.cookies.set(COOKIE_NAME, raw, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			expires: expiresAt
		});

		return res;
	} catch (error) {
		console.error("Verification error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
