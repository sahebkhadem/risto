import { ListStatus } from "@/generated/prisma";

// Helper to map frontend string to Prisma enum
export function toListStatusEnum(status: string): ListStatus | undefined {
	const upper = status.toUpperCase();
	if (Object.values(ListStatus).includes(upper as ListStatus)) {
		return upper as ListStatus;
	}
	return undefined;
}
