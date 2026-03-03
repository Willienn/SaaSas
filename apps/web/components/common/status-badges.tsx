import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/mocks/orders";
import type { PaymentMethod, PaymentStatus } from "@/mocks/payments";
import type { RaffleStatus } from "@/mocks/raffles";
import type { UserRole } from "@/mocks/users";

function badgeTone(className: string, label: string) {
	return (
		<Badge
			className={cn(
				"border px-2.5 py-1 text-[11px] uppercase tracking-[0.08em]",
				className,
			)}
		>
			{label}
		</Badge>
	);
}

export function RaffleStatusBadge({ status }: { status: RaffleStatus }) {
	const map: Record<RaffleStatus, { label: string; className: string }> = {
		active: {
			label: "active",
			className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
		},
		closed: {
			label: "closed",
			className: "border-primary/40 bg-primary/10 text-primary",
		},
		draft: {
			label: "draft",
			className: "border-slate-500/50 bg-slate-500/10 text-slate-300",
		},
		cancelled: {
			label: "cancelled",
			className: "border-red-500/40 bg-red-500/10 text-red-300",
		},
	};

	return badgeTone(map[status].className, map[status].label);
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
	const map: Record<OrderStatus, { label: string; className: string }> = {
		paid: {
			label: "paid",
			className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
		},
		pending: {
			label: "pending",
			className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
		},
		failed: {
			label: "failed",
			className: "border-red-500/40 bg-red-500/10 text-red-300",
		},
		cancelled: {
			label: "cancelled",
			className: "border-slate-500/50 bg-slate-500/10 text-slate-300",
		},
	};

	return badgeTone(map[status].className, map[status].label);
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
	const map: Record<PaymentStatus, { label: string; className: string }> = {
		paid: {
			label: "paid",
			className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
		},
		pending: {
			label: "pending",
			className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
		},
		failed: {
			label: "failed",
			className: "border-red-500/40 bg-red-500/10 text-red-300",
		},
		refunded: {
			label: "refunded",
			className: "border-sky-500/40 bg-sky-500/10 text-sky-300",
		},
	};

	return badgeTone(map[status].className, map[status].label);
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
	const labels: Record<PaymentMethod, string> = {
		pix: "pix",
		boleto: "boleto",
		credit_card: "credit card",
		debit_card: "debit card",
	};

	return badgeTone(
		"border-border/80 bg-muted/40 text-foreground",
		labels[method],
	);
}

export function RoleBadge({ role }: { role: UserRole }) {
	const className =
		role === "admin"
			? "border-primary/40 bg-primary/10 text-primary"
			: "border-border/80 bg-muted/40 text-muted-foreground";

	return badgeTone(className, role);
}
