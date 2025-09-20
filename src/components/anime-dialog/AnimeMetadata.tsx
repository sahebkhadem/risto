type AnimeMetadataProps = {
	name: string;
	value: string | string[] | number;
};

const AnimeMetadata: React.FC<AnimeMetadataProps> = ({ name, value }) => {
	return (
		<div className="text-sm max-w-52">
			<span className="text-muted-foreground">{name}: </span>
			<span className="font-bold break-words">
				{Array.isArray(value) ? value.join(", ") : value}
			</span>
		</div>
	);
};

export default AnimeMetadata;
