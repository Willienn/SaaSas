"use client";

import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import { PaginationControls } from "@/components/common/pagination-controls";
import {
	PaymentMethodBadge,
	PaymentStatusBadge,
} from "@/components/common/status-badges";
import { useMockSession } from "@/components/providers/mock-session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { usePagination } from "@/hooks/use-pagination";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { payments } from "@/mocks/payments";

export function PaymentsTable() {
	const { isAdmin } = useMockSession();
	const isLoading = useMockLoading();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [methodFilter, setMethodFilter] = useState("all");

	const filteredPayments = useMemo(() => {
		return payments.filter((payment) => {
			const matchesSearch =
				payment.id.toLowerCase().includes(search.toLowerCase()) ||
				payment.orderId.toLowerCase().includes(search.toLowerCase());
			const matchesStatus =
				statusFilter === "all" ? true : payment.status === statusFilter;
			const matchesMethod =
				methodFilter === "all" ? true : payment.method === methodFilter;

			return matchesSearch && matchesStatus && matchesMethod;
		});
	}, [methodFilter, search, statusFilter]);

	const { currentPage, pageItems, setCurrentPage, totalPages } = usePagination(
		filteredPayments,
		6,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [methodFilter, search, setCurrentPage, statusFilter]);

	if (isLoading) {
		return <LoadingTableSkeleton rows={7} />;
	}

	return (
		<section className="space-y-4">
			<header className="space-y-1">
				<h2 className="text-2xl font-semibold uppercase tracking-[0.04em]">
					Payments
				</h2>
				<p className="text-sm text-muted-foreground">
					Mocked payment ledger with local filters only.
				</p>
			</header>

			<Card>
				<CardHeader className="space-y-3">
					<CardTitle className="text-base uppercase tracking-[0.05em]">
						History
					</CardTitle>
					<div className="grid gap-2 md:grid-cols-[1fr_220px_220px]">
						<Input
							placeholder="Search by payment or order id"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All status</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>

						<Select value={methodFilter} onValueChange={setMethodFilter}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Method" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All methods</SelectItem>
								<SelectItem value="pix">Pix</SelectItem>
								<SelectItem value="credit_card">Credit Card</SelectItem>
								<SelectItem value="debit_card">Debit Card</SelectItem>
								<SelectItem value="boleto">Boleto</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{filteredPayments.length === 0 ? (
						<EmptyState
							icon={SearchX}
							title="No payments found"
							description="No mocked payment matches the selected filters."
							ctaLabel="Reset filters"
							onCtaClick={() => {
								setSearch("");
								setStatusFilter("all");
								setMethodFilter("all");
							}}
						/>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Payment ID</TableHead>
										<TableHead>Order ID</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Method</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Processed At</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageItems.map((payment) => (
										<TableRow key={payment.id}>
											<TableCell className="font-medium">
												{payment.id}
											</TableCell>
											<TableCell>{payment.orderId}</TableCell>
											<TableCell>{formatCurrency(payment.amount)}</TableCell>
											<TableCell>
												<PaymentMethodBadge method={payment.method} />
											</TableCell>
											<TableCell>
												<PaymentStatusBadge status={payment.status} />
											</TableCell>
											<TableCell>
												{formatDateTime(payment.processedAt)}
											</TableCell>
											<TableCell className="text-right">
												{isAdmin && payment.status === "paid" ? (
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															console.log("[mock] refund payment", payment.id);
															toast.success(
																"Mock refund initiated in console.",
															);
														}}
													>
														Refund
													</Button>
												) : (
													<span className="text-xs text-muted-foreground">
														-
													</span>
												)}
											</TableCell>
										</TableRow>
									))}
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
