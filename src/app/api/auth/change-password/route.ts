import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { COOKIE_NAME, getAuthenticatedUser } from "@/lib/session";
import { z } from "zod";

const passwordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required."),
	newPassword: z.string().min(8, "New password must be at least 8 characters.")
});

// POST /api/change-password
// Updates a user's password after validating the current password.
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { currentPassword, newPassword } = passwordSchema.parse(body);

		// Get authenticated user
		const { user, error } = await getAuthenticatedUser(req);

		// If user is not authenticated, return error
		if (!user) {
			return error;
		}

		// Verify current password
		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ field: "currentPassword", error: "Current password is incorrect" },
				{ status: 400 }
			);
		}

		// Verify that the new password and current password are not the same
		if (currentPassword === newPassword) {
			return NextResponse.json(
				{
					field: "newPassword",
					error: "New password cannot be the same as the current password"
				},
				{ status: 400 }
			);
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update user and invalidate other sessions in a transaction
		await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { password: hashedPassword },
				select: { id: true }
			}),
			prisma.session.deleteMany({
				where: {
					userId: user.id,
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
