"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/layout/Navbar";
import Spinner from "@/components/ui/Spinner";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
	const { isSessionValidating, isSigningOut } = useAuthStore();

	const pathname = usePathname();

	if (
		(isSessionValidating || isSigningOut) &&
		!["/verify", "/alert"].includes(pathname)
	) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner size={12} />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen">
			<Navbar className="h-20" />
			<main className="flex-1 h-full">{children}</main>
		</div>
	);
}
