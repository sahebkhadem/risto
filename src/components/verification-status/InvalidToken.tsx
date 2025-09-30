import { ShieldClose } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
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

const formSchema = z.object({
	email: z.string().email({
		message: "Invalid email."
	})
});

interface InvalidTokenProps {
	isPassword?: boolean;
}
export default function InvalidToken({
	isPassword = false
}: InvalidTokenProps) {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: ""
		}
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const res = await fetch("/api/auth/verify/regenerate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(values)
			});

			// If no user found, display error
			if (res.status === 404) {
				form.setError("email", {
					type: "server",
					message: "No user found with this email address."
				});

				return;
			}

			// If rate limit exceeded, display error
			if (res.status === 429) {
				form.setError("email", {
					type: "server",
					message: "Too many requests. Please try again later."
				});

				return;
			}

			// If success, display success dialog
			setIsOpen(true);
		} catch (error) {
			console.log(error);
			form.setError("email", {
				type: "server",
				message: "Failed to send verification email. Try again later."
			});
		}
	};

	if (isPassword) {
		return (
			<div className="flex flex-col justify-center items-center gap-4">
				<ShieldClose size={100} className="text-primary" />
				<p className="text-lg text-muted-foreground">
					Invalid or missing token.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center items-center gap-4">
			<AlertDialog open={isOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Email sent</AlertDialogTitle>
						<AlertDialogDescription>
							Verification email has been sent to your inbox. Please click the
							link in the email to verify your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setIsOpen(false)}>
							Ok
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ShieldClose size={100} className="text-primary" />
			<p className="text-lg text-muted-foreground">
				Invalid or missing token. Enter your email to resend the verification
				email.
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col items-center gap-4 border p-4 rounded-md"
				>
					<FormLabel className="text-lg">Resend Verification Email</FormLabel>
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
						Resend Verification Email
					</LoadingButton>
				</form>
			</Form>
		</div>
	);
}
