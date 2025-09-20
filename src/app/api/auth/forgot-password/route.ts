import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { checkAndUpdateRateLimit } from "@/lib/rateLimiting";
import { TokenType } from "@/generated/prisma";
import { sendEmail } from "@/lib/mail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const forgotPasswordEmailSchema = z.object({
	email: z
		.string()
		.email("Invalid email address.")
		.min(1, "Invalid email address.")
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email } = forgotPasswordEmailSchema.parse(body);

		// Find user by email
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json({
				message: "If this email is registered, you will receive a reset link."
			});
		}

		// Rate limiting check
		// NOTE: Current rate limiting is user-based.
		// TODO: Add IP-based limiter to protect against spam with fake emails.
		// const allowed = await checkAndUpdateRateLimit(user.id);
		// if (!allowed) {
		// 	return NextResponse.json(
		// 		{ error: "Too many requests. Please try again later." },
		// 		{ status: 429, headers: { "Retry-After": "3600" } }
		// 	);
		// }

		// Generate passwrod reset token
		const passwordResetToken = crypto.randomUUID();
		// 24 hrs
		const passwordResetTokenExpiresAt = new Date(
			Date.now() + 1000 * 60 * 60 * 24
		);

		await prisma.verificationToken.create({
			data: {
				token: passwordResetToken,
				userId: user.id,
				type: TokenType.PASSWORD_RESET,
				expiresAt: passwordResetTokenExpiresAt
			}
		});

		// Send email with password reset link
		await sendEmail(user.email, passwordResetToken, {
			subject: "Reset your password",
			component: PasswordResetEmail,
			path: "/verify/reset-password"
		});

		console.log("Successfully generated token.");
		return NextResponse.json(
			{
				message: "If this email is registered, you will receive a reset link."
			},
			{ status: 200 }
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
