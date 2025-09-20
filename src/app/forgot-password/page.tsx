"use client";

import FullHeightContainer from "@/components/layout/FullHeightContainer";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { toast } from "sonner";

const formSchema = z.object({
	email: z.string().email({
		message: "Invalid email."
	})
});

export default function VerificationAlert() {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: ""
		}
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				body: JSON.stringify({
					email: data.email
				}),
				headers: { "Content-Type": "application/json" }
			});

			if (!res.ok) {
				if (res.status === 429) {
					toast.error("Too many requests. Please try again later.");
					return;
				}
				throw new Error();
			}

			setIsOpen(true);
		} catch (error) {
			console.error(error);
			toast.error("Sorry, something went wrong.");
		}
	};

	return (
		<FullHeightContainer>
			<AlertDialog open={isOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Email sent</AlertDialogTitle>
						<AlertDialogDescription>
							If an account exists with this email, you will receive an email
							with a link to reset your password.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setIsOpen(false)}>
							Ok
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Lock size={100} className="text-primary" />
			<h1 className="text-4xl font-bold">Reset your password</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-start gap-4 p-4 rounded-md"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Email" {...field} className="w-64" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<LoadingButton
						type="submit"
						isLoading={form.formState.isSubmitting}
						className="w-fit"
					>
						Send
					</LoadingButton>
				</form>
			</Form>
		</FullHeightContainer>
	);
}
