import { ListStatus } from "@/generated/prisma";

// Client-side values (lowercase, matches Zod/forms)
export const listStatusValues = [
	"watching",
	"planning",
	"completed",
	"dropped"
] as const;

export type ListStatusClient = (typeof listStatusValues)[number];

// Map Prisma enum -> client union
export function toClientStatus(status: ListStatus): ListStatusClient {
	return status.toLowerCase() as ListStatusClient;
}

// Map client union -> Prisma enum
export function toPrismaStatus(status: ListStatusClient): ListStatus {
	return status.toUpperCase() as ListStatus;
}
