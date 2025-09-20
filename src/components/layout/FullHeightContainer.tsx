export default function FullHeightContainer({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full min-h-full flex justify-center items-center flex-col gap-4">
			{children}
		</div>
	);
}
