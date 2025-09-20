import { Button, type buttonVariants } from "./button";
import Spinner from "./Spinner";

type ButtonProps = React.ComponentProps<typeof Button> & {
	isLoading?: boolean;
	type: "button" | "submit";
	clickHandler?: () => void;
};

export function LoadingButton({
	isLoading,
	children,
	type = "submit",
	variant = "default",
	clickHandler,
	className
}: ButtonProps) {
	const spinnerColor =
		variant === "default" ? "var(--primary-foreground)" : "var(--primary)";

	if (type === "button" && clickHandler !== null) {
		return (
			<Button
				disabled={isLoading}
				className={className}
				variant={variant}
				onClick={clickHandler}
			>
				{isLoading ? <Spinner color={spinnerColor} size={6} /> : children}
			</Button>
		);
	}

	return (
		<Button disabled={isLoading} className={className} variant={variant}>
			{isLoading ? <Spinner color={spinnerColor} size={6} /> : children}
		</Button>
	);
}
