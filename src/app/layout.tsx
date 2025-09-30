import type { Metadata } from "next";
import { palanquin, bytesized } from "@/app/fonts";
import "./globals.css";
import SessionInitializer from "@/components/SessionInitializer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppShell from "@/components/AppShell";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Risto | Anime tracker",
	description: "Keep track of your anime."
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${palanquin.variable} ${bytesized.variable}`}
		>
			<body className="font-sans antialiased">
				<Toaster />

				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SessionInitializer />
					<AppShell>{children}</AppShell>
				</ThemeProvider>
			</body>
		</html>
	);
}
