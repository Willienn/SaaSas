"use client";

import { SearchX, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import { PaginationControls } from "@/components/common/pagination-controls";
import { RaffleStatusBadge } from "@/components/common/status-badges";
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
import { raffles } from "@/mocks/raffles";

export function RafflesTable() {
	const { isAdmin } = useMockSession();
	const isLoading = useMockLoading();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filtered = useMemo(() => {
		return raffles.filter((raffle) => {
			const matchesSearch =
				raffle.title.toLowerCase().includes(search.toLowerCase()) ||
				raffle.description.toLowerCase().includes(search.toLowerCase());
			const matchesStatus =
				statusFilter === "all" ? true : raffle.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [search, statusFilter]);

	const { currentPage, pageItems, setCurrentPage, totalPages } = usePagination(
		filtered,
		5,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, setCurrentPage, statusFilter]);

	if (isLoading) {
		return <LoadingTableSkeleton />;
	}

	return (
		<section className="space-y-4">
			<header className="space-y-1">
				<h2 className="text-2xl font-semibold uppercase tracking-[0.04em]">
					Raffles
				</h2>
				<p className="text-sm text-muted-foreground">
					Client-side filtering and pagination with local mocks only.
				</p>
			</header>

			<Card>
				<CardHeader className="space-y-3">
					<CardTitle className="text-base uppercase tracking-[0.05em]">
						Catalog
					</CardTitle>
					<div className="grid gap-2 md:grid-cols-[1fr_220px]">
						<Input
							placeholder="Search by title or description"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{filtered.length === 0 ? (
						<EmptyState
							icon={SearchX}
							title="No raffles found"
							description="Try another keyword or remove the selected filters."
							ctaLabel="Clear filters"
							onCtaClick={() => {
								setSearch("");
								setStatusFilter("all");
							}}
						/>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Raffle</TableHead>
										<TableHead>Ticket Price</TableHead>
										<TableHead>Sold Tickets</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Ends At</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageItems.map((raffle) => (
										<TableRow key={raffle.id}>
											<TableCell>
												<p className="font-medium">{raffle.title}</p>
												<p className="line-clamp-1 text-xs text-muted-foreground">
													{raffle.description}
												</p>
											</TableCell>
											<TableCell>
												{formatCurrency(raffle.ticketPrice)}
											</TableCell>
											<TableCell>
												{raffle.soldTickets}/{raffle.totalTickets}
											</TableCell>
											<TableCell>
												<RaffleStatusBadge status={raffle.status} />
											</TableCell>
											<TableCell>{formatDateTime(raffle.endsAt)}</TableCell>
											<TableCell className="space-x-2 text-right">
												<Button asChild variant="outline" size="sm">
													<Link href={`/raffles/${raffle.id}`}>View</Link>
												</Button>
												{isAdmin ? (
													<Button
														variant="destructive"
														size="sm"
														onClick={() => {
															console.log("[mock] delete raffle", raffle.id);
															toast.success(
																"Mock delete action logged in console.",
															);
														}}
													>
														<Trash2 className="size-4" />
													</Button>
												) : null}
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
