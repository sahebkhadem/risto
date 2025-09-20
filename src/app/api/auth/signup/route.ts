import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mail";
import { z } from "zod";
import { TokenType } from "@/generated/prisma";
import VerificationEmail from "@/emails/VerificationEmail";

const signUpSchema = z.object({
	email: z
		.string()
		.email("Invalid email address.")
		.min(1, "Invalid email address."),
	password: z.string().min(8, "Password must be at least 8 characters long.")
});

// Sign Up route
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password } = signUpSchema.parse(body);

		// Check if the user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: "A user with this email already exists." },
				{ status: 409 }
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword }
		});

		// Generate verification token
		const verificationToken = crypto.randomUUID();
		// 24 hrs
		const verificationTokenExpiresAt = new Date(
			Date.now() + 1000 * 60 * 60 * 24
		);

		await prisma.verificationToken.create({
			data: {
				token: verificationToken,
				userId: newUser.id,
				type: TokenType.EMAIL_VERIFICATION,
				expiresAt: verificationTokenExpiresAt
			}
		});

		await sendEmail(newUser.email, verificationToken, {
			subject: "Action required to verify your account",
			component: VerificationEmail,
			path: "/verify/email-verification"
		});

		return NextResponse.json(
			{ message: "User created. Please verify your email." },
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
