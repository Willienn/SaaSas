"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
	return (
		<header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="group inline-flex items-center gap-2">
					<span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
						Rifa
					</span>
					<span className="text-lg font-semibold uppercase tracking-[0.08em] group-hover:text-primary">
						LuckyDrop
					</span>
				</Link>

				<div className="flex items-center gap-2">
					<Button asChild variant="ghost" size="sm">
						<Link href="/meus-pedidos">Minhas compras</Link>
					</Button>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
