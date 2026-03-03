import { ArrowRight, CircleDollarSign, HandCoins, Trophy } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RaffleCard } from "@/src/components/features/public/raffle-card";
import { formatDate } from "@/src/lib/utils";
import { rafflesMock } from "@/src/mocks/raffles";

const lastWinners = [
	{
		name: "Marina Souza",
		prize: "Porsche 911 Carrera 2020",
		date: "2026-02-18T21:00:00.000Z",
	},
	{
		name: "Douglas Pereira",
		prize: "Viagem para Dubai para 2 pessoas",
		date: "2026-02-10T20:30:00.000Z",
	},
	{
		name: "Sabrina Costa",
		prize: "Kit Studio Gamer Black Edition",
		date: "2026-01-30T19:45:00.000Z",
	},
];

const steps = [
	{
		title: "Escolha",
		description:
			"Navegue pelas rifas, compare os prêmios e selecione a melhor oportunidade.",
		icon: Trophy,
	},
	{
		title: "Compre",
		description:
			"Defina seus números ou escolha modo aleatório e finalize o pagamento em minutos.",
		icon: HandCoins,
	},
	{
		title: "Aguarde",
		description:
			"Acompanhe os resultados em tempo real e receba confirmação da sua participação.",
		icon: CircleDollarSign,
	},
];

export function HomeView() {
	const featuredRaffles = rafflesMock
		.filter((raffle) => raffle.status === "active")
		.slice(0, 3);

	return (
		<section className="space-y-14 pb-6">
			<section className="grid gap-8 rounded-2xl border border-border/70 bg-card/50 p-7 lg:grid-cols-[1.2fr_1fr] lg:p-10">
				<div className="space-y-6">
					<p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
						A próxima chance pode ser sua
					</p>
					<h1 className="text-4xl font-semibold leading-[1.03] tracking-[0.03em] sm:text-5xl lg:text-6xl">
						Rifas com grandes prêmios e emoção até o último número
					</h1>
					<p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
						Participe de sorteios exclusivos em um fluxo simples e transparente.
						Escolha seus bilhetes, acompanhe o resultado e viva a expectativa.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild size="lg">
							<Link href="/rifas">
								Ver rifas
								<ArrowRight className="size-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/meus-pedidos">Minhas compras</Link>
						</Button>
					</div>
				</div>

				<div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
					<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
						Em destaque
					</p>
					<h2 className="mt-2 text-2xl">
						{featuredRaffles[0]?.title ?? "Rifa ativa"}
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Compre seus números agora e acompanhe os resultados ao vivo no dia
						do sorteio.
					</p>
					<img
						src={`https://picsum.photos/seed/${featuredRaffles[0]?.id ?? "hero"}/600/420`}
						alt="Rifa destaque"
						className="mt-4 h-52 w-full rounded-lg object-cover"
					/>
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-end justify-between gap-4">
					<div>
						<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
							Rifas em destaque
						</p>
						<h2 className="mt-1 text-3xl">Escolha sua próxima chance</h2>
					</div>
					<Button asChild variant="ghost">
						<Link href="/rifas">Ver todas</Link>
					</Button>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{featuredRaffles.map((raffle) => (
						<RaffleCard key={raffle.id} raffle={raffle} />
					))}
				</div>
			</section>

			<section className="space-y-4">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
					Como funciona
				</p>
				<div className="grid gap-4 md:grid-cols-3">
					{steps.map((step) => (
						<Card key={step.title} className="border-border/80 bg-card/70">
							<CardHeader className="space-y-3">
								<step.icon className="size-6 text-primary" />
								<CardTitle className="text-2xl">{step.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									{step.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
					Últimos ganhadores
				</p>
				<div className="grid gap-4 md:grid-cols-3">
					{lastWinners.map((winner) => (
						<Card
							key={`${winner.name}-${winner.prize}`}
							className="border-border/80 bg-card/70"
						>
							<CardHeader>
								<CardTitle className="text-xl">{winner.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-1 text-sm">
								<p className="text-muted-foreground">Prêmio: {winner.prize}</p>
								<p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
									{formatDate(winner.date)}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</section>
	);
}
