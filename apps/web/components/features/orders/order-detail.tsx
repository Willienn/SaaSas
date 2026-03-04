"use client";

import { AlertCircle, CheckCircle2, Clock3, Receipt } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import {
	OrderStatusBadge,
	PaymentMethodBadge,
	PaymentStatusBadge,
} from "@/components/common/status-badges";
import { useMockSession } from "@/components/providers/mock-session-provider";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { orders } from "@/mocks/orders";
import { payments } from "@/mocks/payments";
import { raffles } from "@/mocks/raffles";
import { users } from "@/mocks/users";

type TimelineItem = {
	title: string;
	description: string;
	done: boolean;
};

export function OrderDetail({ orderId }: { orderId: string }) {
	const isLoading = useMockLoading();
	const { isAdmin } = useMockSession();

	const order = orders.find((item) => item.id === orderId);

	if (isLoading) {
		return <LoadingTableSkeleton rows={6} />;
	}

	if (!order) {
		return (
			<EmptyState
				icon={AlertCircle}
				title="Order not found"
				description="This order ID does not exist in the local mocked dataset."
			/>
		);
	}

	const raffle = raffles.find((item) => item.id === order.raffleId);
	const user = users.find((item) => item.id === order.userId);
	const payment = payments.find((item) => item.orderId === order.id);

	const timeline: TimelineItem[] = [
		{
			title: "Order created",
			description: `Created at ${formatDateTime(order.createdAt)}`,
			done: true,
		},
		{
			title: "Payment requested",
			description: payment
				? `Method: ${payment.method.replace("_", " ")}`
				: "Awaiting payment record",
			done: !!payment,
		},
		{
			title:
				payment?.status === "paid"
					? "Payment approved"
					: payment?.status === "failed"
						? "Payment failed"
						: payment?.status === "refunded"
							? "Payment refunded"
							: "Awaiting confirmation",
			description: payment
				? `Updated at ${formatDateTime(payment.processedAt)}`
				: "No update yet",
			done:
				payment?.status === "paid" ||
				payment?.status === "failed" ||
				payment?.status === "refunded",
		},
	];

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button asChild variant="outline" size="sm">
					<Link href="/orders">Back to orders</Link>
				</Button>
				<OrderStatusBadge status={order.status} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl uppercase tracking-[0.04em]">
						Order {order.id}
					</CardTitle>
					<CardDescription>
						Complete lifecycle details for this mocked order.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<article className="rounded-md border border-border/70 bg-background/40 p-3">
						<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
							User
						</p>
						<p className="mt-1 text-sm font-semibold">
							{user?.name ?? "Unknown user"}
						</p>
						<p className="text-xs text-muted-foreground">
							{user?.email ?? "-"}
						</p>
					</article>
					<article className="rounded-md border border-border/70 bg-background/40 p-3">
						<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
							Raffle
						</p>
						<p className="mt-1 text-sm font-semibold">
							{raffle?.title ?? "Unknown raffle"}
						</p>
						<p className="text-xs text-muted-foreground">
							Quantity: {order.quantity}
						</p>
					</article>
					<article className="rounded-md border border-border/70 bg-background/40 p-3">
						<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
							Amount
						</p>
						<p className="mt-1 text-sm font-semibold">
							{formatCurrency(order.totalAmount)}
						</p>
						<p className="text-xs text-muted-foreground">
							Created: {formatDateTime(order.createdAt)}
						</p>
					</article>
					<article className="rounded-md border border-border/70 bg-background/40 p-3">
						<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
							Payment
						</p>
						{payment ? (
							<div className="mt-2 flex flex-wrap gap-1.5">
								<PaymentMethodBadge method={payment.method} />
								<PaymentStatusBadge status={payment.status} />
							</div>
						) : (
							<p className="mt-1 text-sm text-muted-foreground">
								No payment found
							</p>
						)}
					</article>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-start justify-between gap-3">
					<div>
						<CardTitle className="uppercase tracking-[0.04em]">
							Status Timeline
						</CardTitle>
						<CardDescription>
							Mocked order evolution with payment checkpoints.
						</CardDescription>
					</div>
					{isAdmin ? (
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								console.log("[mock] force refund for order", order.id);
								toast.success("Mock refund action logged in console.");
							}}
						>
							Force Refund
						</Button>
					) : null}
				</CardHeader>
				<CardContent className="space-y-4">
					{timeline.map((item, index) => (
						<div
							key={item.title}
							className="grid grid-cols-[1.25rem_1fr] gap-3"
						>
							<div className="flex flex-col items-center">
								<span
									className={cn(
										"mt-0.5 size-3.5 rounded-full border",
										item.done
											? "border-emerald-400/80 bg-emerald-400/80"
											: "border-muted-foreground/40 bg-transparent",
									)}
								/>
								{index < timeline.length - 1 ? (
									<Separator
										orientation="vertical"
										className="my-1 h-12 bg-border/70"
									/>
								) : null}
							</div>
							<div className="rounded-md border border-border/70 bg-background/40 p-3">
								<div className="mb-1 flex items-center gap-2 text-sm font-medium">
									{item.done ? (
										<CheckCircle2 className="size-4 text-emerald-400" />
									) : (
										<Clock3 className="size-4 text-amber-400" />
									)}
									{item.title}
								</div>
								<p className="text-xs text-muted-foreground">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="uppercase tracking-[0.04em]">
						Audit note
					</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					<p>
						<Receipt className="mr-2 inline size-4 text-primary" />
						This page intentionally avoids API requests. Replace static lookups
						with query hooks da API when backend contracts are ready.
					</p>
				</CardContent>
			</Card>
		</section>
	);
}
