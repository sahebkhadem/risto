"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useAnimeStore } from "@/store/useAnimeStore";
import PasswordChangeDialog from "../password-change-dialog/PasswordChangeDialog";

const SettingsDropdown: React.FC = () => {
	// Sign out handler
	async function onSignOutSelect() {
		useAuthStore.getState().setIsSigningOut(true);

		try {
			const res = await fetch("/api/auth/session", { method: "DELETE" });

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Something went wrong.");
			} else {
				useAuthStore.getState().setUser(null);
				useAuthStore.getState().setIsSigningOut(false);

				useAnimeStore.getState().clearLists();

				toast.success("You are signed out.");
			}
		} catch (err) {
			console.log(err);
			useAuthStore.getState().setIsSigningOut(false);
			toast.error("Sorry, something went wrong.");
		}
	}

	return (
		<DropdownMenu>
			<Button asChild size="icon" variant="outline">
				<DropdownMenuTrigger>
					<Settings />
				</DropdownMenuTrigger>
			</Button>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<PasswordChangeDialog>
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault();
							event.stopPropagation();
						}}
					>
						Change Password
					</DropdownMenuItem>
				</PasswordChangeDialog>
				<DropdownMenuItem variant="destructive" onSelect={onSignOutSelect}>
					<LogOut /> Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SettingsDropdown;
