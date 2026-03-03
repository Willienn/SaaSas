"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const isDark = resolvedTheme === "dark";

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Button
			variant="outline"
			size="icon-sm"
			aria-label="Toggle theme"
			disabled={!mounted}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="border-primary/30"
		>
			{mounted && isDark ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
		</Button>
	);
}
