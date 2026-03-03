import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
	title: "Underground Lottery - Mini SaaS",
	description: "Mocked frontend for raffles, orders and payments",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans text-foreground antialiased">
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
}
