import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Heading,
	Text,
	Button,
	Section,
	Link,
	Tailwind,
	pixelBasedPreset
} from "@react-email/components";

type Props = {
	url: string;
	email?: string;
};

export default function PasswordResetEmail({ url, email }: Props) {
	return (
		<Html>
			<Head />
			<Tailwind
				config={{
					presets: [pixelBasedPreset]
				}}
			>
				<Body>
					<Preview>Reset your password</Preview>
					<Container className="rounded-md bg-[#09090b] text-white p-8">
						<Section>
							<Heading className="font-bold text-3xl">
								Reset your password
							</Heading>
							<Text>
								{email ? `Hi ${email},` : "Hi,"} please click the link below to
								reset your password.
							</Text>
							<Section className="my-24" style={{ textAlign: "center" }}>
								<Button
									className="rounded bg-[#615fff] px-6 py-4 text-center font-semibold text-white no-underline"
									href={url}
								>
									Reset Password
								</Button>
							</Section>
							<Text>
								The button doesn’t work? Copy and paste this link into your
								browser:
							</Text>
							<Link href={url}>{url}</Link>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
