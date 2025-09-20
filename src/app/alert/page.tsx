"use client";

import FullHeightContainer from "@/components/layout/FullHeightContainer";
import { Mail } from "lucide-react";

export default function VerificationAlert() {
	return (
		<FullHeightContainer>
			<Mail size={100} className="text-primary" />
			<h1 className="text-4xl font-bold">Verify your email.</h1>
			<p className="text-muted-foreground text-sm">
				An email has been sent to your inbox. Please click the link in the email
				to verify your account.
			</p>
		</FullHeightContainer>
	);
}
