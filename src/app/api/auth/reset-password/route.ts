import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { COOKIE_NAME } from "@/lib/session";
import { z } from "zod";

const resetPasswordSchema = z.object({
	newPassword: z.string().min(1, "Current password is required."),
	userId: z.string().min(1, "User ID is required.")
});

// POST /api/auth/reset-password
// Reset a user's password
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { newPassword, userId } = resetPasswordSchema.parse(body);

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update user and invalidate other sessions in a transaction
		await prisma.$transaction([
			prisma.user.update({
				where: { id: userId },
				data: { password: hashedPassword },
				select: { id: true }
			}),
			prisma.session.deleteMany({
				where: {
					userId: userId,
					NOT: { token: req.cookies.get(COOKIE_NAME)?.value }
				}
			})
		]);

		// Clear current cookie
		const res = NextResponse.json({
			message: "Password updated, please log in again"
		});
		res.cookies.delete(COOKIE_NAME);

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

		console.error("Password change error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
