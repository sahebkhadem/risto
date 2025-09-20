"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const SessionInitializer: React.FC = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (["/verify", "/alert"].includes(pathname)) {
			return;
		}

		async function checkSession() {
			try {
				const res = await fetch("/api/auth/session");
				const data = await res.json();

				if (res.ok) {
					useAuthStore.getState().setUser(data.user);
				}
			} catch {
				toast("Something went wrong.");
			} finally {
				useAuthStore.getState().setIsValidatingSession(false);
			}
		}

		checkSession();
	}, []);

	// no UI
	return null;
};

export default SessionInitializer;
