import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
};

export function EmptyState({
	icon: Icon,
	title,
	description,
	ctaLabel,
	onCtaClick,
}: EmptyStateProps) {
	return (
		<Card className="border-dashed bg-card/70">
			<CardHeader className="pb-2 text-center">
				<div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/60">
					<Icon className="size-5 text-primary" />
				</div>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 text-center">
				<p className="text-sm text-muted-foreground">{description}</p>
				{ctaLabel ? (
					<Button variant="outline" onClick={onCtaClick}>
						{ctaLabel}
					</Button>
				) : null}
			</CardContent>
		</Card>
	);
}
