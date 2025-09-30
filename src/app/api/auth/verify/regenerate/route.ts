import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { regenerateVerificationToken } from "@/lib/verification";
import { checkAndUpdateRateLimit } from "@/lib/rateLimiting";
import { TokenType } from "@/generated/prisma";
import VerificationEmail from "@/emails/VerificationEmail";

const regenerateTokenSchema = z.object({
	email: z
		.string()
		.email("Invalid email address.")
		.min(1, "Invalid email address.")
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email } = regenerateTokenSchema.parse(body);

		// Find user by email
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json(
				{
					error:
						"No user found with this email address. Please check and try again."
				},
				{ status: 404 }
			);
		}

		// Rate limiting check
		// NOTE: Current rate limiting is user-based.
		// TODO: Add IP-based limiter to protect against spam with fake emails.
		const allowed = await checkAndUpdateRateLimit(user.id);
		if (!allowed) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again later." },
				{ status: 429, headers: { "Retry-After": "3600" } }
			);
		}

		// Regenerate token and send email
		const token = await regenerateVerificationToken(
			user.id,
			TokenType.EMAIL_VERIFICATION
		);

		await sendEmail(user.email, token, {
			subject: "Action required to verify your account",
			component: VerificationEmail,
			path: "/verify/email-verification"
		});

		console.log("Successfully generated token.");
		return NextResponse.json(
			{ message: "Verification email sent. Please check your inbox." },
			{ status: 201 }
		);
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
