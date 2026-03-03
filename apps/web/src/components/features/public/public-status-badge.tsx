import { Badge } from "@/components/ui/badge";
import {
	getPublicStatus,
	getPublicStatusLabel,
} from "@/src/components/features/public/helpers";
import { cn } from "@/src/lib/utils";
import type { Raffle } from "@/src/types";

export function PublicStatusBadge({ status }: { status: Raffle["status"] }) {
	const normalized = getPublicStatus(status);

	return (
		<Badge
			className={cn(
				"border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]",
				normalized === "active"
					? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
					: "border-slate-500/50 bg-slate-500/10 text-slate-300",
			)}
		>
			{getPublicStatusLabel(status)}
		</Badge>
	);
}
