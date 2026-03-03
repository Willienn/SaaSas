"use client";

import { SearchX, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import { PaginationControls } from "@/components/common/pagination-controls";
import { OrderStatusBadge } from "@/components/common/status-badges";
import { useMockSession } from "@/components/providers/mock-session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { usePagination } from "@/hooks/use-pagination";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { orders } from "@/mocks/orders";
import { raffles } from "@/mocks/raffles";
import { users } from "@/mocks/users";

type OrderTab = "all" | "pending" | "paid" | "failed";

export function OrdersTable() {
	const { isAdmin } = useMockSession();
	const isLoading = useMockLoading();
	const [search, setSearch] = useState("");
	const [statusTab, setStatusTab] = useState<OrderTab>("all");

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const raffle = raffles.find((item) => item.id === order.raffleId);
			const user = users.find((item) => item.id === order.userId);

			const matchesText =
				order.id.toLowerCase().includes(search.toLowerCase()) ||
				(raffle?.title.toLowerCase().includes(search.toLowerCase()) ?? false) ||
				(user?.name.toLowerCase().includes(search.toLowerCase()) ?? false);

			const matchesStatus =
				statusTab === "all" ? true : order.status === statusTab;

			return matchesText && matchesStatus;
		});
	}, [search, statusTab]);

	const { currentPage, pageItems, setCurrentPage, totalPages } = usePagination(
		filteredOrders,
		6,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, setCurrentPage, statusTab]);

	if (isLoading) {
		return <LoadingTableSkeleton rows={7} />;
	}

	return (
		<section className="space-y-4">
			<header className="space-y-1">
				<h2 className="text-2xl font-semibold uppercase tracking-[0.04em]">
					Orders
				</h2>
				<p className="text-sm text-muted-foreground">
					Tabs by status and client-side filtering over mock data.
				</p>
			</header>

			<Card>
				<CardHeader className="space-y-3">
					<CardTitle className="text-base uppercase tracking-[0.05em]">
						Order Pipeline
					</CardTitle>
					<div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
						<Input
							placeholder="Search by order, raffle or user"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<Tabs
							value={statusTab}
							onValueChange={(value) => setStatusTab(value as OrderTab)}
						>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="pending">Pending</TabsTrigger>
								<TabsTrigger value="paid">Paid</TabsTrigger>
								<TabsTrigger value="failed">Failed</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{filteredOrders.length === 0 ? (
						<EmptyState
							icon={SearchX}
							title="No orders found"
							description="The current tab and filters returned no matching order."
							ctaLabel="Reset"
							onCtaClick={() => {
								setSearch("");
								setStatusTab("all");
							}}
						/>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Order</TableHead>
										<TableHead>Raffle</TableHead>
										<TableHead>User</TableHead>
										<TableHead>Qty</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created At</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageItems.map((order) => {
										const raffle = raffles.find(
											(item) => item.id === order.raffleId,
										);
										const user = users.find((item) => item.id === order.userId);

										return (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													{order.id}
												</TableCell>
												<TableCell>
													{raffle?.title ?? "Unknown raffle"}
												</TableCell>
												<TableCell>{user?.name ?? "Unknown user"}</TableCell>
												<TableCell>{order.quantity}</TableCell>
												<TableCell>
													{formatCurrency(order.totalAmount)}
												</TableCell>
												<TableCell>
													<OrderStatusBadge status={order.status} />
												</TableCell>
												<TableCell>{formatDateTime(order.createdAt)}</TableCell>
												<TableCell className="space-x-2 text-right">
													<Button asChild size="sm" variant="outline">
														<Link href={`/orders/${order.id}`}>View</Link>
													</Button>
													{isAdmin && order.status === "pending" ? (
														<Button
															variant="destructive"
															size="sm"
															onClick={() => {
																console.log(
																	"[mock] cancel pending order",
																	order.id,
																);
																toast.success(
																	"Mock cancellation logged in console.",
																);
															}}
														>
															<ShieldAlert className="size-4" />
														</Button>
													) : null}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
