import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getPublicStatusLabel,
	getRaffleProgress,
} from "@/src/components/features/public/helpers";
import { PublicStatusBadge } from "@/src/components/features/public/public-status-badge";
import { formatCurrency } from "@/src/lib/utils";
import type { Raffle } from "@/src/types";

type RaffleCardProps = {
	raffle: Raffle;
};

export function RaffleCard({ raffle }: RaffleCardProps) {
	const progress = getRaffleProgress(raffle);

	return (
		<Card className="overflow-hidden border-border/80 bg-card/80">
			<div className="relative">
				<img
					src={`https://picsum.photos/seed/${raffle.id}/400/300`}
					alt={raffle.title}
					className="h-44 w-full object-cover"
				/>
				<div className="absolute left-3 top-3">
					<PublicStatusBadge status={raffle.status} />
				</div>
			</div>
			<CardHeader className="space-y-2 pb-2">
				<p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
					{getPublicStatusLabel(raffle.status)}
				</p>
				<CardTitle className="line-clamp-2 text-lg leading-tight">
					{raffle.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Bilhete</span>
					<span className="font-semibold text-primary">
						{formatCurrency(raffle.ticketPrice)}
					</span>
				</div>

				<div className="space-y-1.5">
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span>Progresso</span>
						<span>{progress.toFixed(1)}%</span>
					</div>
					<div className="h-2 rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={`/rifas/${raffle.id}`}>Participar</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
