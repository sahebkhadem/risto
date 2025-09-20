"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";

const validationMessage = "Password must be at least 8 characters.";

const formSchema = z
	.object({
		currentPassword: z.string().min(8, {
			message: validationMessage
		}),
		newPassword: z.string().min(8, {
			message: validationMessage
		}),
		confirmNewPassword: z.string().min(8, {
			message: validationMessage
		})
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match.",
		path: ["confirmNewPassword"]
	});

const PasswordChangeForm: React.FC = () => {
	const [hasPasswordChanged, setHasPasswordChanged] = useState(false);
	const [isLoading, setIsloading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: ""
		}
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsloading(true);

		try {
			const res = await fetch("/api/auth/change-password", {
				method: "POST",
				body: JSON.stringify({
					currentPassword: data.currentPassword,
					newPassword: data.newPassword
				}),
				headers: { "Content-Type": "application/json" }
			});

			const resData = await res.json();

			if (!res.ok) {
				// Check if the response contains a field-specific error
				if (resData.field && resData.error) {
					form.setError(resData.field as keyof z.infer<typeof formSchema>, {
						type: "manual",
						message: resData.error
					});
				} else {
					// Handle generic errors (no specific field)
					toast.error(resData.error || "Sorry, something went wrong.");
				}
				setIsloading(false);
				return;
			}

			form.reset();
			setHasPasswordChanged(true);
			setIsloading(false);
			toast.success("Password updated successfully!");
		} catch (error) {
			console.error("Error during password change:", error);
			toast.error("Sorry, something went wrong.");
			setIsloading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col justify-center space-y-8"
			>
				<DialogHeader>
					<DialogTitle>Change password</DialogTitle>
				</DialogHeader>

				{hasPasswordChanged && !isLoading && (
					<Alert>
						<CircleCheck />
						<AlertTitle className="break-all">
							Your password has been changed. Please sign in again.
						</AlertTitle>
					</Alert>
				)}

				{/* Current password */}
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Current password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* New password */}
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="New password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Confirm new password */}
				<FormField
					control={form.control}
					name="confirmNewPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm new password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Confirm new password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<LoadingButton type="submit" isLoading={isLoading}>
					Change password
				</LoadingButton>
			</form>
		</Form>
	);
};
export default PasswordChangeForm;
