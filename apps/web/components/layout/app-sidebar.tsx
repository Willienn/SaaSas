"use client";

import {
	BarChart3,
	CreditCard,
	Shield,
	Ticket,
	Trophy,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { useMockSession } from "@/components/providers/mock-session-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
	href: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
	adminOnly?: boolean;
};

const navItems: NavItem[] = [
	{ href: "/dashboard", label: "Dashboard", icon: BarChart3 },
	{ href: "/raffles", label: "Raffles", icon: Trophy },
	{ href: "/orders", label: "Orders", icon: Ticket },
	{ href: "/payments", label: "Payments", icon: CreditCard },
	{ href: "/users", label: "Users", icon: Users, adminOnly: true },
];

export function AppSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const { isAdmin } = useMockSession();

	return (
		<div className="flex h-full flex-col px-3 py-4">
			<div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5">
				<p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
					Underground Lottery
				</p>
				<h1 className="mt-1 text-lg font-semibold uppercase tracking-[0.06em]">
					Raffles Control
				</h1>
			</div>

			<nav className="space-y-1.5">
				{navItems
					.filter((item) => (item.adminOnly ? isAdmin : true))
					.map((item) => {
						const active =
							pathname === item.href || pathname.startsWith(`${item.href}/`);

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onNavigate}
								className={cn(
									"group flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition",
									active
										? "border-primary/50 bg-primary/15 text-primary"
										: "border-transparent text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground",
								)}
							>
								<span className="flex items-center gap-2.5">
									<item.icon
										className={cn(
											"size-4",
											active
												? "text-primary"
												: "text-muted-foreground group-hover:text-foreground",
										)}
									/>
									<span>{item.label}</span>
								</span>
								{item.adminOnly ? (
									<Badge
										className={cn(
											"text-[10px] uppercase tracking-[0.08em]",
											active
												? "border-primary/40 bg-primary/15 text-primary"
												: "border-border/70 bg-muted/30 text-muted-foreground",
										)}
									>
										admin
									</Badge>
								) : null}
							</Link>
						);
					})}
			</nav>

			<div className="mt-auto rounded-lg border border-border/70 bg-card/80 p-3">
				<div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
					<Shield className="size-3.5 text-primary" />
					<span>Access profile</span>
				</div>
				<p className="text-sm leading-relaxed text-foreground/85">
					User permissions and destructive actions are simulated locally for
					RBAC validation.
				</p>
			</div>
		</div>
	);
}
