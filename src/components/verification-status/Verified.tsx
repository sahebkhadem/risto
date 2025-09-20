import { ShieldCheck } from "lucide-react";

export default function Verified() {
	return (
		<div className="flex flex-col justify-center items-center gap-4">
			<ShieldCheck size={100} className="text-primary" />
			<h1 className="text-4xl font-bold">You are now verified.</h1>
		</div>
	);
}
