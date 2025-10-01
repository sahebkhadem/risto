import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { listStatusValues } from "@/types/ListStatus";

interface StatusSelectorProps {
	value: string | null;
	onChange: (value: string | null) => void;
	disabled?: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
	value,
	onChange,
	disabled
}) => {
	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	// Ensure we never pass empty string as value
	const currentValue = value || undefined;

	return (
		<Select value={currentValue} onValueChange={onChange} disabled={disabled}>
			<SelectTrigger>
				<SelectValue placeholder="Set status">
					{value && capitalize(value.toLowerCase())}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{listStatusValues.map((status) => (
					<SelectItem
						key={status}
						value={status}
						onClick={() => onChange(status)}
					>
						{capitalize(status)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default StatusSelector;
