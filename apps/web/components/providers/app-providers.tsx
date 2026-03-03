"use client";

import type * as React from "react";
import { MockSessionProvider } from "@/components/providers/mock-session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<MockSessionProvider>
				{children}
				<Toaster richColors position="top-right" />
			</MockSessionProvider>
		</ThemeProvider>
	);
}
