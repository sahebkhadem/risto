"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { LogIn } from "lucide-react";

const AUTH_MODES = {
	SIGN_IN: "signin",
	SIGN_UP: "signup"
} as const;

type AuthMode = (typeof AUTH_MODES)[keyof typeof AUTH_MODES];

const AuthDialog: React.FC = () => {
	const [authMode, setAuthMode] = useState<AuthMode>(AUTH_MODES.SIGN_IN);
	const [open, setOpen] = useState(false);

	const toggleAuthMode = () => {
		if (authMode === AUTH_MODES.SIGN_IN) {
			setAuthMode(AUTH_MODES.SIGN_UP);
			return;
		}

		setAuthMode(AUTH_MODES.SIGN_IN);
	};

	const setDialogIsOpen = (value: boolean) => {
		setOpen(value);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => setAuthMode(AUTH_MODES.SIGN_IN)}
					variant="default"
				>
					<LogIn /> Sign In
				</Button>
			</DialogTrigger>
			<DialogContent className="custom-max-width">
				{authMode === AUTH_MODES.SIGN_IN ? (
					<SignInForm
						toggleAuthMode={toggleAuthMode}
						setDialogIsOpen={setDialogIsOpen}
					/>
				) : (
					<SignUpForm
						toggleAuthMode={toggleAuthMode}
						setDialogIsOpen={setDialogIsOpen}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AuthDialog;
