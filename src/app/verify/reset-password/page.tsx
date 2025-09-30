"use client";

import FullHeightContainer from "@/components/layout/FullHeightContainer";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import InvalidToken from "@/components/verification-status/InvalidToken";
import Verifying from "@/components/verification-status/Verifying";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TokenStatus = "verifying" | "invalid" | "verified";

export default function VerifyResetPassword() {
	const [tokenStatus, setTokenStatus] = useState<TokenStatus>("verifying");
	const [user, setUser] = useState("");

	const params = useSearchParams();

	useEffect(() => {
		const token = params.get("token");
		if (!token) {
			setTokenStatus("invalid");
			return;
		}

		// Abort controller to handle cleanup
		const abortController = new AbortController();

		const verifyResetToken = async () => {
			try {
				const res = await fetch(
					`/api/auth/verify?token=${params.get("token")}`,
					{ signal: abortController.signal }
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error();
				}
				setUser(data.user);
				setTokenStatus("verified");
			} catch (error: unknown) {
				// Don't show toast if the request was aborted
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					(error as { name?: string }).name !== "AbortError"
				) {
					toast.error("Sorry, something went wrong.");
				}
				// Only set invalid status if it wasn't aborted
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					(error as { name?: string }).name !== "AbortError"
				) {
					setTokenStatus("invalid");
				}
			}
		};

		verifyResetToken();

		// Cleanup function - abort the request if component unmounts or re-runs
		return () => {
			abortController.abort();
		};
	}, [params]);

	return (
		<FullHeightContainer>
			{tokenStatus === "verifying" && <Verifying isPassword={true} />}
			{tokenStatus === "invalid" && <InvalidToken isPassword={true} />}
			{tokenStatus === "verified" && <ResetPasswordForm user={user} />}
		</FullHeightContainer>
	);
}
