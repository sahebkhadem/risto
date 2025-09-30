"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { LoadingButton } from "../ui/LoadingButton";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";

// Zod schema for validating the sign-in form fields.
const formSchema = z.object({
	email: z.string().email({
		message: "Invalid email."
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters."
	})
});

type SignInFormProps = {
	toggleAuthMode: () => void;
	setDialogIsOpen: (value: boolean) => void;
};

const SignInForm: React.FC<SignInFormProps> = ({
	toggleAuthMode,
	setDialogIsOpen
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	// Handle form submit
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				body: JSON.stringify(values),
				headers: { "Content-Type": "application/json" }
			});

			const data = await res.json();

			// If the response is not OK, handle errors
			if (!res.ok) {
				// If there are field-specific errors, set them in the form
				if (data.errors && Array.isArray(data.errors)) {
					data.errors.forEach((err: { field: string; error: string }) => {
						form.setError(err.field as keyof typeof values, {
							type: "server",
							message: err.error
						});
					});
				} else {
					// Show a generic error toast if no field errors are present
					toast.error(data.error || "Something went wrong.");
				}
			} else {
				// On success, reset the form, update the user in the auth store, and show a success toast
				form.reset();
				useAuthStore.getState().setUser(data.user);
				toast.success("Signed in successfully!");
			}
		} catch (err) {
			console.log(err);
			toast.error("Network error. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<DialogHeader>
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>
						Sign in to your account to track your anime!
					</DialogDescription>
				</DialogHeader>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<Link
						href="/forgot-password"
						className="text-sm text-muted-foreground hover:underline"
						onClick={() => setDialogIsOpen(false)}
					>
						Forgot your password?
					</Link>
				</div>

				<div className="flex items-center gap-4">
					<LoadingButton
						type="submit"
						isLoading={form.formState.isSubmitting}
						className="flex-1"
					>
						Sign In
					</LoadingButton>

					<Separator orientation="vertical" color="#fff" className="min-h-7" />

					<Button
						variant="outline"
						className="flex-1 text-sm text-muted-foreground hover:text-foreground"
						onClick={toggleAuthMode}
						disabled={form.formState.isSubmitting}
					>
						Sign Up
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignInForm;
