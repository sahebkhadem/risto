"use client";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import PasswordChangeForm from "./PasswordChangeForm";

const PasswordChangeDialog: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className="custom-max-width">
				<PasswordChangeForm />
			</DialogContent>
		</Dialog>
	);
};

export default PasswordChangeDialog;
