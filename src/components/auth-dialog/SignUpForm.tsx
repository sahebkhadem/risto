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
import { LoadingButton } from "../ui/LoadingButton";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const formSchema = z
	.object({
		email: z.string().email({
			message: "Invalid email."
		}),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters."
		}),
		confirmPassword: z.string().min(8, {
			message: "Please confirm your password."
		})
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"]
	});

type SignUpFormProps = {
	toggleAuthMode: () => void;
	setDialogIsOpen: (value: boolean) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
	toggleAuthMode,
	setDialogIsOpen
}) => {
	const router = useRouter();

	// Initialize form with react-hook-form and zod
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: ""
		}
	});

	// Handle form submit
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify(values),
				headers: { "Content-Type": "application/json" }
			});

			const data = await res.json();

			if (!res.ok) {
				// Handle field errors from backend
				if (data.errors && Array.isArray(data.errors)) {
					data.errors.forEach((err: { field: string; error: string }) => {
						form.setError(err.field as keyof typeof values, {
							type: "server",
							message: err.error
						});
					});
				} else {
					toast.error(data.error || "Something went wrong.");
				}
			} else {
				router.push("/alert");
				form.reset();
				setDialogIsOpen(false);
			}
		} catch (err) {
			toast.error("Sorry, something went wrong.");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<DialogHeader>
					<DialogTitle>Sign Up</DialogTitle>
					<DialogDescription>
						Create your account to track your anime!
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

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Confirm password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center gap-4">
					<LoadingButton
						type="submit"
						className="flex-1"
						isLoading={form.formState.isSubmitting}
					>
						Sign Up
					</LoadingButton>

					<Separator orientation="vertical" color="#fff" className="min-h-7" />

					<Button
						variant="outline"
						className="flex-1 text-sm text-muted-foreground hover:text-foreground"
						onClick={toggleAuthMode}
						disabled={form.formState.isSubmitting}
					>
						Sign In
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignUpForm;
