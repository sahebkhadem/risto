import { checkAndUpdateRateLimit } from "@/lib/rateLimiting";
import prisma from "@/lib/prisma";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
	rateLimit: {
		findUnique: jest.fn(),
		update: jest.fn(),
		upsert: jest.fn()
	}
}));

describe("checkAndUpdateRateLimit", () => {
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new rate limit record and allow request when none exists", async () => {
		// Mock Prisma findUnique to return null (no existing record)
		(prisma.rateLimit.findUnique as jest.Mock).mockResolvedValue(null);

		// Mock Prisma upsert to simulate creating a new record
		(prisma.rateLimit.upsert as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 1,
			windowEnd: new Date(Date.now() + 1000 * 60 * 60)
		});

		// Call the function
		const result = await checkAndUpdateRateLimit("user123", 3, 1000 * 60 * 60);

		// Assert the result
		expect(result).toBe(true);

		// Assert Prisma calls
		expect(prisma.rateLimit.findUnique).toHaveBeenCalledWith({
			where: { userId: "user123" }
		});
		expect(prisma.rateLimit.upsert).toHaveBeenCalledWith({
			where: { userId: "user123" },
			update: { count: 1, windowEnd: expect.any(Date) },
			create: { userId: "user123", count: 1, windowEnd: expect.any(Date) }
		});
		expect(prisma.rateLimit.update).not.toHaveBeenCalled();
	});

	it("should increment count and allow request when within limit", async () => {
		// Mock Prisma findUnique to return an existing record within window
		const now = new Date();
		const windowEnd = new Date(now.getTime() + 1000 * 60 * 60);
		(prisma.rateLimit.findUnique as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 1,
			windowEnd
		});

		// Mock Prisma update to simulate incrementing count
		(prisma.rateLimit.update as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 2,
			windowEnd
		});

		// Call the function
		const result = await checkAndUpdateRateLimit("user123", 3, 1000 * 60 * 60);

		// Assert the result
		expect(result).toBe(true);

		// Assert Prisma calls
		expect(prisma.rateLimit.findUnique).toHaveBeenCalledWith({
			where: { userId: "user123" }
		});
		expect(prisma.rateLimit.update).toHaveBeenCalledWith({
			where: { userId: "user123" },
			data: { count: { increment: 1 } }
		});
		expect(prisma.rateLimit.upsert).not.toHaveBeenCalled();
	});

	it("should block request when rate limit is exceeded", async () => {
		// Mock Prisma findUnique to return an existing record with count >= maxRequests
		const now = new Date();
		const windowEnd = new Date(now.getTime() + 1000 * 60 * 60);
		(prisma.rateLimit.findUnique as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 3,
			windowEnd
		});

		// Call the function
		const result = await checkAndUpdateRateLimit("user123", 3, 1000 * 60 * 60);

		// Assert the result
		expect(result).toBe(false);

		// Assert Prisma calls
		expect(prisma.rateLimit.findUnique).toHaveBeenCalledWith({
			where: { userId: "user123" }
		});
		expect(prisma.rateLimit.update).not.toHaveBeenCalled();
		expect(prisma.rateLimit.upsert).not.toHaveBeenCalled();
	});

	it("should reset count and allow request when rate limit window has expired", async () => {
		// Mock Prisma findUnique to return an existing record with expired window
		const now = new Date();
		const expiredWindowEnd = new Date(now.getTime() - 1000); // 1 second in the past
		(prisma.rateLimit.findUnique as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 3,
			windowEnd: expiredWindowEnd
		});

		// Mock Prisma upsert to simulate resetting count
		const newWindowEnd = new Date(now.getTime() + 1000 * 60 * 60);
		(prisma.rateLimit.upsert as jest.Mock).mockResolvedValue({
			userId: "user123",
			count: 1,
			windowEnd: newWindowEnd
		});

		// Call the function
		const result = await checkAndUpdateRateLimit("user123", 3, 1000 * 60 * 60);

		// Assert the result
		expect(result).toBe(true);

		// Assert Prisma calls
		expect(prisma.rateLimit.findUnique).toHaveBeenCalledWith({
			where: { userId: "user123" }
		});
		expect(prisma.rateLimit.upsert).toHaveBeenCalledWith({
			where: { userId: "user123" },
			update: { count: 1, windowEnd: expect.any(Date) },
			create: { userId: "user123", count: 1, windowEnd: expect.any(Date) }
		});
		expect(prisma.rateLimit.update).not.toHaveBeenCalled();
	});
});
