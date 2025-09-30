"use client";

import FullHeightContainer from "@/components/layout/FullHeightContainer";
import InvalidToken from "@/components/verification-status/InvalidToken";
import Verified from "@/components/verification-status/Verified";
import Verifying from "@/components/verification-status/Verifying";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TokenStatus = "verifying" | "invalid" | "verified";

export default function VerifyEmail() {
	const [tokenStatus, setTokenStatus] = useState<TokenStatus>("verifying");
	const [_user, setUser] = useState("");

	const params = useSearchParams();

	useEffect(() => {
		const token = params.get("token");
		if (!token) {
			setTokenStatus("invalid");
			return;
		}

		// Abort controller to handle cleanup
		const abortController = new AbortController();

		const verifyEmail = async () => {
			try {
				const res = await fetch(
					`/api/auth/verify?token=${params.get("token")}`,
					{ signal: abortController.signal }
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error();
				}

				useAuthStore.getState().setUser(data.user);
				setUser(data.user);
				setTokenStatus("verified");
			} catch (error: unknown) {
				// Don't show toast if the request was aborted
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					(error as { name: string }).name !== "AbortError"
				) {
					toast.error("Sorry, something went wrong.");
				}
				// Only set invalid status if it wasn't aborted
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					(error as { name: string }).name !== "AbortError"
				) {
					setTokenStatus("invalid");
				}
			}
		};

		verifyEmail();

		// Cleanup function - abort the request if component unmounts or re-runs
		return () => {
			abortController.abort();
		};
	}, [params]);

	return (
		<FullHeightContainer>
			{tokenStatus === "verifying" && <Verifying />}
			{tokenStatus === "invalid" && <InvalidToken />}
			{tokenStatus === "verified" && <Verified />}
		</FullHeightContainer>
	);
}
