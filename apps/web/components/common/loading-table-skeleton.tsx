import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingTableSkeletonProps = {
	rows?: number;
};

export function LoadingTableSkeleton({ rows = 6 }: LoadingTableSkeletonProps) {
	return (
		<Card>
			<CardHeader className="space-y-2">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-4 w-72" />
			</CardHeader>
			<CardContent className="space-y-3">
				{Array.from({ length: rows }).map((_, index) => (
					<Skeleton key={`row-${index}`} className="h-10 w-full" />
				))}
			</CardContent>
		</Card>
	);
}
