import { z } from "zod";

// Zod schema for validating the sign-in form fields.
export const formSchema = z.object({
	episode: z.string().min(1),
	status: z.string()
});
