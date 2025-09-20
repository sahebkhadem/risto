import { ShieldQuestionMark } from "lucide-react";
import Spinner from "../ui/Spinner";

export default function Verifying({
	isPassword = false
}: {
	isPassword?: boolean;
}) {
	return (
		<div className="flex flex-col justify-center items-center gap-4">
			<ShieldQuestionMark size={100} className="text-primary" />
			<p className="text-lg text-muted-foreground">
				{isPassword
					? "Please wait while we verify you."
					: "Please wait while we verify your email."}
			</p>
			<Spinner size={12} />
		</div>
	);
}
