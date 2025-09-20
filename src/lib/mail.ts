import { Resend } from "resend";
import { render, pretty } from "@react-email/render";
import { createElement, ComponentType } from "react";

if (!process.env.RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY is not set in environment variables.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = { url: string; email: string };

export async function sendEmail(
	to: string,
	token: string,
	{
		subject,
		component,
		path,
		moreParams
	}: {
		subject: string;
		component: ComponentType<EmailProps>;
		path: string; // e.g. "/verify" or "/reset-password"
		moreParams?: [{ name: string; value: string }];
	}
) {
	// Build query params
	const params = new URLSearchParams({ token });

	// Add extra params if provided
	if (moreParams && moreParams.length > 0) {
		moreParams.forEach(({ name, value }) => {
			params.append(name, value);
		});
	}

	const url = `${process.env.NEXT_PUBLIC_APP_URL}${path}?${params.toString()}`;

	const html = await pretty(
		await render(createElement(component, { url, email: to }))
	);
	const text = `${subject}: ${url}`;

	try {
		await resend.emails.send({
			from: "Risto <onboarding@resend.dev>",
			to,
			subject,
			html,
			text
		});
	} catch (error) {
		console.error("Email send failed:", error);
	}
}
