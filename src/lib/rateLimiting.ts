import prisma from "@/lib/prisma";

/**
 * Rate limiting helper.
 *
 * NOTE: Currently rate-limiting is tied to userId.
 * In a production-grade system, we’d also want to have
 * IP-based limits for unauthenticated routes (e.g. signin, forgot-password)
 * to prevent abuse from non-logged-in users.
 */

export async function checkAndUpdateRateLimit(
	userId: string,
	maxRequests = 3,
	windowMs = 1000 * 60 * 60
) {
	const now = new Date();
	const windowEnd = new Date(now.getTime() + windowMs);

	const rateLimit = await prisma.rateLimit.findUnique({
		where: { userId }
	});

	if (rateLimit && rateLimit.windowEnd > now) {
		if (rateLimit.count >= maxRequests) {
			return false; // Rate limit exceeded
		}
		await prisma.rateLimit.update({
			where: { userId },
			data: { count: { increment: 1 } }
		});
	} else {
		await prisma.rateLimit.upsert({
			where: { userId },
			update: { count: 1, windowEnd },
			create: { userId, count: 1, windowEnd }
		});
	}
	return true; // Allowed
}
