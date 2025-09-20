import { TokenType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function regenerateVerificationToken(
	userId: string,
	type: TokenType
) {
	// Generate verification token
	const verificationToken = crypto.randomUUID();
	const verificationTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

	// Delete existing tokens and create a new one
	await prisma.$transaction([
		prisma.verificationToken.deleteMany({ where: { userId } }),
		prisma.verificationToken.create({
			data: {
				token: verificationToken,
				userId,
				type,
				expiresAt: verificationTokenExpiresAt
			}
		})
	]);

	return verificationToken;
}
