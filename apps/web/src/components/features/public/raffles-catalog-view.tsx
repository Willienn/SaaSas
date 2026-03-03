"use client";

import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { PaginationControls } from "@/components/common/pagination-controls";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import {
	getPublicStatus,
	sortRaffles,
} from "@/src/components/features/public/helpers";
import { RaffleCard } from "@/src/components/features/public/raffle-card";
import { rafflesMock } from "@/src/mocks/raffles";

export function RafflesCatalogView() {
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "ended">(
		"all",
	);
	const [sortBy, setSortBy] = useState<
		"price_asc" | "price_desc" | "ending_soon" | "most_sold"
	>("most_sold");

	const filtered = useMemo(() => {
		const byStatus = rafflesMock.filter((raffle) => {
			if (statusFilter === "all") {
				return true;
			}

			return getPublicStatus(raffle.status) === statusFilter;
		});

		return sortRaffles(byStatus, sortBy);
	}, [sortBy, statusFilter]);

	const { currentPage, pageItems, setCurrentPage, totalPages } = usePagination(
		filtered,
		6,
	);

	return (
		<section className="space-y-6 pb-6">
			<header className="space-y-2">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
					Catálogo
				</p>
				<h1 className="text-4xl">Escolha sua próxima rifa</h1>
				<p className="text-muted-foreground">
					Filtre por status e ordene as oportunidades com base no seu perfil.
				</p>
			</header>

			<div className="grid gap-3 rounded-xl border border-border/80 bg-card/60 p-4 md:grid-cols-2">
				<div className="space-y-1.5">
					<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
						Status
					</p>
					<Select
						value={statusFilter}
						onValueChange={(value: "all" | "active" | "ended") => {
							setCurrentPage(1);
							setStatusFilter(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todas</SelectItem>
							<SelectItem value="active">Ativas</SelectItem>
							<SelectItem value="ended">Encerradas</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
						Ordenação
					</p>
					<Select
						value={sortBy}
						onValueChange={(
							value: "price_asc" | "price_desc" | "ending_soon" | "most_sold",
						) => {
							setCurrentPage(1);
							setSortBy(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="most_sold">Mais vendidas</SelectItem>
							<SelectItem value="ending_soon">Encerrando em breve</SelectItem>
							<SelectItem value="price_asc">Menor preço</SelectItem>
							<SelectItem value="price_desc">Maior preço</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{filtered.length === 0 ? (
				<EmptyState
					icon={SearchX}
					title="Nenhuma rifa encontrada"
					description="Tente alterar os filtros para ver outras oportunidades."
				/>
			) : (
				<>
					<div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
						{pageItems.map((raffle) => (
							<RaffleCard key={raffle.id} raffle={raffle} />
						))}
					</div>
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</>
			)}
		</section>
	);
}
