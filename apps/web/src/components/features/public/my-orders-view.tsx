import { TicketX } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { OrderStatusBadge } from "@/components/common/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deriveOrderNumbers } from "@/src/components/features/public/helpers";
import { formatCurrency, formatDateTime } from "@/src/lib/utils";
import { ordersMock } from "@/src/mocks/orders";
import { rafflesMock } from "@/src/mocks/raffles";
import { MOCK_LOGGED_USER } from "@/src/mocks/users";

export function MyOrdersView() {
	const myOrders = ordersMock
		.filter((order) => order.userId === MOCK_LOGGED_USER.id)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

	if (myOrders.length === 0) {
		return (
			<EmptyState
				icon={TicketX}
				title="Você ainda não tem pedidos"
				description="Participe de uma rifa ativa para começar seu histórico."
				ctaLabel="Ver rifas"
				onCtaClick={() => {
					window.location.href = "/rifas";
				}}
			/>
		);
	}

	return (
		<section className="space-y-4 pb-6">
			<header className="space-y-2">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
					Minhas compras
				</p>
				<h1 className="text-4xl">Histórico de pedidos</h1>
			</header>

			<div className="space-y-3">
				{myOrders.map((order) => {
					const raffle = rafflesMock.find((item) => item.id === order.raffleId);
					if (!raffle) {
						return null;
					}

					const numbers = deriveOrderNumbers(order, raffle);

					return (
						<Card key={order.id} className="border-border/80 bg-card/80">
							<CardHeader className="flex flex-row items-start justify-between gap-3">
								<div>
									<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
										Pedido {order.id}
									</p>
									<CardTitle className="text-xl">{raffle.title}</CardTitle>
								</div>
								<OrderStatusBadge status={order.status} />
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex flex-wrap items-center gap-4">
									<span className="text-muted-foreground">
										Total pago: {formatCurrency(order.totalAmount)}
									</span>
									<span className="text-muted-foreground">
										Data: {formatDateTime(order.createdAt)}
									</span>
								</div>
								<p className="font-mono text-xs text-primary">
									Bilhetes: {numbers.join(", ")}
								</p>
								<Button asChild variant="outline" size="sm">
									<Link href={`/resultado/${raffle.id}`}>Ver resultado</Link>
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
