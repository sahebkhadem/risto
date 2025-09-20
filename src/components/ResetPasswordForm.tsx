"use client";

import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

type ResetPasswordFormProps = {
	user: string;
};

const resetPasswordFromSchema = z
	.object({
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

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFromSchema>;

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ user }) => {
	const form = useForm<ResetPasswordFormSchema>({
		resolver: zodResolver(resetPasswordFromSchema),
		defaultValues: {
			password: "",
			confirmPassword: ""
		}
	});

	const router = useRouter();

	const submitHandler = async (data: ResetPasswordFormSchema) => {
		try {
			const reqBody = { newPassword: data.password, userId: user };

			await fetch(`/api/auth/reset-password`, {
				method: "POST",
				body: JSON.stringify(reqBody),
				headers: { "Content-Type": "application/json" }
			});

			toast.success(
				"Password changed successfully! Redirecting you to the homepage.",
				{
					duration: 5000
				}
			);

			router.replace("/");
		} catch (error) {
			console.error(error);
			toast.error("Sorry. Something went wrong.");
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submitHandler)}
				onClick={(e) => e.stopPropagation()}
				className="w-sm max-w-full flex flex-col gap-4 rounded-md border p-6"
			>
				<h1 className="text-2xl font-bold">Reset your password</h1>
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

				<LoadingButton
					variant="default"
					className=""
					isLoading={form.formState.isSubmitting}
					type="submit"
				>
					<span className="text-sm">Change Password</span>
				</LoadingButton>
			</form>
		</Form>
	);
};

export default ResetPasswordForm;
