import PulseLoader from "react-spinners/PulseLoader";

type SpinnerProps = {
	size?: number;
	color?: string;
	className?: string;
};

export default function Spinner({
	size = 24,
	color = "var(--primary)",
	className = ""
}: SpinnerProps) {
	return (
		<PulseLoader
			color={color}
			loading={true}
			size={size}
			className={className}
			aria-label="Loading Spinner"
			data-testid="loader"
		/>
	);
}
