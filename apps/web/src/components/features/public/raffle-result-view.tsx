"use client";

import { Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	formatCountdown,
	hashString,
} from "@/src/components/features/public/helpers";
import { formatDateTime } from "@/src/lib/utils";
import { rafflesMock } from "@/src/mocks/raffles";

const winnerNames = [
	"Carla Menezes",
	"Lucas Almeida",
	"Brenda Araujo",
	"Thiago Campos",
	"Renata Fonseca",
	"Danilo Souza",
];

export function RaffleResultView({ raffleId }: { raffleId: string }) {
	const raffle = rafflesMock.find((item) => item.id === raffleId);
	const [countdown, setCountdown] = useState(
		raffle ? formatCountdown(raffle.endsAt) : "0d 0h 0m 0s",
	);
	const [revealing, setRevealing] = useState(false);
	const [displayNumber, setDisplayNumber] = useState<number | null>(null);

	const winningNumber = useMemo(() => {
		if (!raffle) {
			return 0;
		}

		return (hashString(`${raffle.id}-winner`) % raffle.totalTickets) + 1;
	}, [raffle]);

	const winnerName = useMemo(() => {
		if (!raffle) {
			return "";
		}

		const index = hashString(`${raffle.id}-name`) % winnerNames.length;
		return winnerNames[index] ?? "Vencedor oculto";
	}, [raffle]);

	useEffect(() => {
		if (!raffle || raffle.status === "closed") {
			return;
		}

		const interval = window.setInterval(() => {
			setCountdown(formatCountdown(raffle.endsAt));
		}, 1000);

		return () => window.clearInterval(interval);
	}, [raffle]);

	if (!raffle) {
		return (
			<EmptyState
				icon={Trophy}
				title="Resultado indisponível"
				description="A rifa solicitada não foi encontrada no mock atual."
			/>
		);
	}

	const ended = raffle.status === "closed";

	return (
		<section className="space-y-5 pb-6">
			<header className="space-y-2">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
					Resultado oficial
				</p>
				<h1 className="text-4xl">{raffle.title}</h1>
			</header>

			{ended ? (
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Sorteio encerrado</CardTitle>
					</CardHeader>
					<CardContent className="space-y-5">
						<p className="text-muted-foreground">
							Clique em revelar para iniciar a roleta e descobrir o número
							vencedor.
						</p>

						<div className="rounded-xl border border-primary/35 bg-primary/10 p-6 text-center">
							<p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
								Número sorteado
							</p>
							<p
								className={`mt-2 text-5xl font-semibold text-primary ${revealing ? "public-roulette" : ""}`}
							>
								{displayNumber ?? "--"}
							</p>
						</div>

						<Button
							type="button"
							disabled={revealing}
							onClick={() => {
								setRevealing(true);
								let ticks = 0;
								const interval = window.setInterval(() => {
									ticks += 1;
									setDisplayNumber(
										(Math.floor(Math.random() * raffle.totalTickets) %
											raffle.totalTickets) +
											1,
									);

									if (ticks >= 24) {
										window.clearInterval(interval);
										setDisplayNumber(winningNumber);
										setRevealing(false);
									}
								}, 90);
							}}
						>
							{displayNumber === winningNumber
								? "Número revelado"
								: "Revelar número"}
						</Button>

						{displayNumber === winningNumber ? (
							<div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
								<p className="font-semibold text-emerald-300">
									Vencedor: {winnerName}
								</p>
								<p className="text-muted-foreground">
									Data do sorteio: {formatDateTime(raffle.endsAt)}
								</p>
							</div>
						) : null}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							Sorteio ainda não realizado
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-muted-foreground">
							A rifa ainda está ativa. Volte ao fim do countdown para conferir o
							resultado oficial.
						</p>
						<div className="rounded-lg border border-primary/35 bg-primary/10 px-4 py-3">
							<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
								Tempo restante
							</p>
							<p className="mt-1 font-mono text-xl text-primary">{countdown}</p>
						</div>
					</CardContent>
				</Card>
			)}
		</section>
	);
}
