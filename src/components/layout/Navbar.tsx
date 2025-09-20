"use client";

import Link from "next/link";

import { bytesized } from "@/app/fonts";
import { ModeToggle } from "../ui/mode-toggle";
import AuthDialog from "../auth-dialog/AuthDialog";
import { useAuthStore } from "@/store/useAuthStore";
import SettingsDropdown from "../ui/SettingsDropdown";

interface Props {
	className: string;
}

const Navbar: React.FC<Props> = ({ className }) => {
	const isSignedIn = useAuthStore((state) => state.user !== null);

	return (
		<nav className={`${className} px-6 py-4 flex justify-between items-center`}>
			<Link href="/">
				<span
					className={`${bytesized.variable} font-logo text-5xl tracking-tighter text-primary`}
				>
					Risto
				</span>
			</Link>

			<div className="flex gap-4">
				<ModeToggle />
				{isSignedIn ? <SettingsDropdown /> : <AuthDialog />}
			</div>
		</nav>
	);
};

export default Navbar;
