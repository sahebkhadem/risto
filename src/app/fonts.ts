import localFont from "next/font/local";

export const bytesized = localFont({
	src: [
		{
			path: "../assets/fonts/Bytesized-Regular.woff2",
			weight: "400",
			style: "normal"
		}
	],
	display: "swap",
	variable: "--font-bytesized"
});
