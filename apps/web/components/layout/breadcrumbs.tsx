"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
	dashboard: "Dashboard",
	raffles: "Raffles",
	orders: "Orders",
	users: "Users",
	payments: "Payments",
};

function formatSegment(segment: string): string {
	if (segmentLabels[segment]) {
		return segmentLabels[segment];
	}

	if (
		segment.startsWith("ord_") ||
		segment.startsWith("raf_") ||
		segment.startsWith("pay_")
	) {
		return `#${segment.slice(-4)}`;
	}

	return segment;
}

export function AppBreadcrumbs() {
	const pathname = usePathname();
	const parts = pathname.split("/").filter(Boolean);

	return (
		<div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
			<Link
				href="/dashboard"
				className="text-foreground/80 hover:text-foreground"
			>
				Home
			</Link>
			{parts.map((part, index) => {
				const href = `/${parts.slice(0, index + 1).join("/")}`;
				const isLast = index === parts.length - 1;
				const label = formatSegment(part);

				return (
					<span key={`${href}-${part}`} className="flex items-center gap-2">
						<ChevronRight className="size-3.5 text-primary/80" />
						{isLast ? (
							<span className="font-medium tracking-[0.1em] text-primary">
								{label}
							</span>
						) : (
							<Link href={href} className="hover:text-foreground">
								{label}
							</Link>
						)}
					</span>
				);
			})}
		</div>
	);
}
