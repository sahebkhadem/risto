import localFont from "next/font/local";

export const palanquin = localFont({
	src: [
		{
			path: "../assets/fonts/palanquin/Palanquin-Thin.ttf",
			weight: "100",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-ExtraLight.ttf",
			weight: "200",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-Light.ttf",
			weight: "300",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-Regular.ttf",
			weight: "400",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-Medium.ttf",
			weight: "500",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-SemiBold.ttf",
			weight: "600",
			style: "normal"
		},
		{
			path: "../assets/fonts/palanquin/Palanquin-Bold.ttf",
			weight: "700",
			style: "normal"
		}
	],
	variable: "--font-palanquin",
	display: "swap"
});

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
