import { Minus, Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";

interface EpisodeCounter {
	episodes: number;
	value: number;
	onChange: (value: number) => void;
	disabled: boolean;
}

type EpisodeCounterProps = {
	episodes: number;
	value?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
};

const clamp = (val: number, min: number, max: number) =>
	Math.max(min, Math.min(max, val));

const EpisodeCounter: React.FC<EpisodeCounterProps> = ({
	episodes,
	value,
	onChange,
	disabled
}) => {
	const isControlled = value !== undefined;
	const [internalEpisode, setInternalEpisode] = useState(0);
	const episode = isControlled ? value! : internalEpisode;

	const setEpisodeSafe = (val: number) => {
		const clamped = clamp(val, 1, episodes);
		if (!isControlled) setInternalEpisode(clamped);
		onChange?.(clamped);
	};

	const handleDecrease = (e: React.MouseEvent) => {
		if (e.ctrlKey && e.shiftKey && e.altKey) {
			setEpisodeSafe(1);
		} else if (e.ctrlKey && e.shiftKey) {
			setEpisodeSafe(episode - 100);
		} else if (e.ctrlKey) {
			setEpisodeSafe(episode - 10);
		} else {
			setEpisodeSafe(episode - 1);
		}
	};

	const handleIncrease = (e: React.MouseEvent) => {
		if (e.ctrlKey && e.shiftKey && e.altKey) {
			setEpisodeSafe(episodes);
		} else if (e.ctrlKey && e.shiftKey) {
			setEpisodeSafe(episode + 100);
		} else if (e.ctrlKey) {
			setEpisodeSafe(episode + 10);
		} else {
			setEpisodeSafe(episode + 1);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseInt(e.target.value, 10);
		if (!isNaN(val)) setEpisodeSafe(val);
	};

	return (
		<div
			className={`flex items-center justify-center space-x-2 ${
				disabled ? "cursor-not-allowed" : ""
			}`}
		>
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="w-6 h-6 shrink-0 rounded-full"
				onClick={handleDecrease}
				disabled={episode <= 1 || disabled}
			>
				<Minus />
				<span className="sr-only">Decrease</span>
			</Button>
			<Input
				type="number"
				className="w-16 text-center flex justify-center items-center font-bold tracking-tighter"
				min={1}
				max={episodes}
				step={1}
				value={episode}
				onChange={handleInputChange}
				disabled={disabled}
			/>
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="w-6 h-6 shrink-0 rounded-full"
				onClick={handleIncrease}
				disabled={episode >= episodes || disabled}
			>
				<Plus />
				<span className="sr-only">Increase</span>
			</Button>
		</div>
	);
};

export default EpisodeCounter;
