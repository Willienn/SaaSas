"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	createSoldNumbers,
	formatCountdown,
	getRaffleProgress,
	pickRandomNumbers,
	rangeNumbers,
} from "@/src/components/features/public/helpers";
import { cn, formatCurrency } from "@/src/lib/utils";
import { rafflesMock } from "@/src/mocks/raffles";
import { MOCK_LOGGED_USER } from "@/src/mocks/users";

const purchaseSchema = z
	.object({
		quantity: z.number().min(1).max(50),
		selectionMode: z.enum(["manual", "random"]),
		selectedNumbers: z.array(z.number()).optional(),
		buyerName: z.string().min(2),
		buyerEmail: z.string().email(),
		buyerPhone: z.string().min(10),
	})
	.superRefine((data, context) => {
		if ((data.selectedNumbers?.length ?? 0) !== data.quantity) {
			context.addIssue({
				path: ["selectedNumbers"],
				code: z.ZodIssueCode.custom,
				message:
					data.selectionMode === "manual"
						? "Selecione exatamente a mesma quantidade de bilhetes."
						: "Clique em Sortear para gerar os números aleatórios.",
			});
		}
	});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export function RaffleDetailView({ raffleId }: { raffleId: string }) {
	const router = useRouter();
	const raffle = rafflesMock.find((item) => item.id === raffleId);

	const [countdown, setCountdown] = useState(
		raffle ? formatCountdown(raffle.endsAt) : "0d 0h 0m 0s",
	);
	const [isRandomizing, setIsRandomizing] = useState(false);
	const [animatedNumbers, setAnimatedNumbers] = useState<number[]>([]);
	const timeoutsRef = useRef<number[]>([]);

	const form = useForm<PurchaseFormData>({
		resolver: zodResolver(purchaseSchema),
		defaultValues: {
			quantity: 1,
			selectionMode: "random",
			selectedNumbers: [],
			buyerName: MOCK_LOGGED_USER.name,
			buyerEmail: MOCK_LOGGED_USER.email,
			buyerPhone: "11988887777",
		},
	});

	const quantity = form.watch("quantity");
	const selectionMode = form.watch("selectionMode");
	const selectedNumbers = form.watch("selectedNumbers") ?? [];

	const soldNumbers = useMemo(() => {
		if (!raffle) {
			return new Set<number>();
		}

		return createSoldNumbers(raffle.totalTickets, raffle.soldTickets);
	}, [raffle]);

	const allNumbers = useMemo(() => {
		if (!raffle) {
			return [];
		}

		return rangeNumbers(raffle.totalTickets);
	}, [raffle]);

	const availableNumbers = useMemo(
		() => allNumbers.filter((number) => !soldNumbers.has(number)),
		[allNumbers, soldNumbers],
	);

	useEffect(() => {
		if (!raffle) {
			return;
		}

		const interval = window.setInterval(() => {
			setCountdown(formatCountdown(raffle.endsAt));
		}, 1000);

		return () => window.clearInterval(interval);
	}, [raffle]);

	useEffect(() => {
		if (selectedNumbers.length > quantity) {
			form.setValue("selectedNumbers", selectedNumbers.slice(0, quantity), {
				shouldValidate: true,
			});
		}
	}, [form, quantity, selectedNumbers]);

	useEffect(() => {
		return () => {
			timeoutsRef.current.forEach((timeout) => {
				window.clearTimeout(timeout);
			});
		};
	}, []);

	if (!raffle) {
		return (
			<EmptyState
				title="Rifa não encontrada"
				description="A rifa solicitada não existe no mock local."
				icon={Shuffle}
			/>
		);
	}

	const progress = getRaffleProgress(raffle);
	const isEnded = new Date(raffle.endsAt).getTime() <= Date.now();

	function clearAnimationQueue() {
		timeoutsRef.current.forEach((timeout) => {
			window.clearTimeout(timeout);
		});
		timeoutsRef.current = [];
	}

	function toggleManualNumber(ticketNumber: number) {
		if (soldNumbers.has(ticketNumber)) {
			return;
		}

		const currentSelection = form.getValues("selectedNumbers") ?? [];
		const hasSelected = currentSelection.includes(ticketNumber);

		if (hasSelected) {
			form.setValue(
				"selectedNumbers",
				currentSelection.filter((item) => item !== ticketNumber),
				{ shouldValidate: true },
			);
			return;
		}

		if (currentSelection.length >= quantity) {
			toast.warning(`Selecione no máximo ${quantity} bilhete(s).`);
			return;
		}

		form.setValue("selectedNumbers", [...currentSelection, ticketNumber], {
			shouldValidate: true,
		});
	}

	function randomizeSelection() {
		if (quantity > availableNumbers.length) {
			toast.error("Quantidade maior que o número de bilhetes disponíveis.");
			return;
		}

		clearAnimationQueue();
		setIsRandomizing(true);
		setAnimatedNumbers([]);

		const picks = pickRandomNumbers(availableNumbers, quantity);

		picks.forEach((number, index) => {
			const timeout = window.setTimeout(
				() => {
					setAnimatedNumbers((previous) => [...previous, number]);

					if (index === picks.length - 1) {
						form.setValue("selectedNumbers", picks, { shouldValidate: true });
						setIsRandomizing(false);
					}
				},
				150 * (index + 1),
			);

			timeoutsRef.current.push(timeout);
		});
	}

	return (
		<section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
			<div className="space-y-4">
				<img
					src={`https://picsum.photos/seed/${raffle.id}/800/500`}
					alt={raffle.title}
					className="h-64 w-full rounded-xl border border-border/80 object-cover md:h-80"
				/>
				<Card>
					<CardHeader>
						<p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
							Prêmio em destaque
						</p>
						<CardTitle className="text-3xl">{raffle.title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-5">
						<p className="text-muted-foreground">{raffle.description}</p>

						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>Bilhetes vendidos</span>
								<span className="font-semibold">{progress.toFixed(1)}%</span>
							</div>
							<div className="h-2 rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-primary"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								{raffle.soldTickets} de {raffle.totalTickets} bilhetes vendidos
							</p>
						</div>

						<div className="rounded-lg border border-primary/35 bg-primary/10 px-4 py-3">
							<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
								Encerramento
							</p>
							<p className="mt-1 font-mono text-lg text-primary">{countdown}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl">Mapa de bilhetes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="max-h-[440px] overflow-auto rounded-lg border border-border/70 p-3">
							<div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
								{allNumbers.map((ticketNumber) => {
									const sold = soldNumbers.has(ticketNumber);
									const selected = selectedNumbers.includes(ticketNumber);
									const animated = animatedNumbers.includes(ticketNumber);

									return (
										<button
											key={ticketNumber}
											type="button"
											disabled={sold || selectionMode !== "manual" || isEnded}
											onClick={() => toggleManualNumber(ticketNumber)}
											className={cn(
												"rounded-md border px-1 py-1 text-[11px] font-mono transition",
												sold &&
													"cursor-not-allowed border-border/30 bg-muted/50 opacity-45",
												!sold &&
													"border-border/70 bg-background/60 hover:border-primary/60",
												selected &&
													"border-primary bg-primary text-primary-foreground",
												animated && "ring-2 ring-primary ring-offset-1",
											)}
										>
											{ticketNumber}
										</button>
									);
								})}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="lg:sticky lg:top-22 lg:h-fit">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Comprar bilhetes</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-4"
								onSubmit={form.handleSubmit((values) => {
									if (isEnded) {
										toast.error("Esta rifa já foi encerrada.");
										return;
									}

									// Salva um snapshot local do checkout para simular o fluxo sem backend.
									const checkoutDraft = {
										raffleId: raffle.id,
										raffleTitle: raffle.title,
										ticketPrice: raffle.ticketPrice,
										quantity: values.quantity,
										selectionMode: values.selectionMode,
										selectedNumbers: values.selectedNumbers ?? [],
										buyerName: values.buyerName,
										buyerEmail: values.buyerEmail,
										buyerPhone: values.buyerPhone,
										totalAmount: values.quantity * raffle.ticketPrice,
										createdAt: new Date().toISOString(),
									};

									sessionStorage.setItem(
										"checkout_draft",
										JSON.stringify(checkoutDraft),
									);
									console.log("[mock] checkout_draft", checkoutDraft);
									router.push(`/rifas/${raffle.id}/checkout`);
								})}
							>
								<FormField
									control={form.control}
									name="quantity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantidade</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<Button
														type="button"
														variant="outline"
														size="icon-sm"
														onClick={() => {
															const next = Math.max(1, quantity - 1);
															field.onChange(next);
														}}
													>
														<Minus className="size-4" />
													</Button>
													<Input
														type="number"
														min={1}
														max={50}
														className="text-center"
														value={field.value}
														onChange={(event) =>
															field.onChange(
																Math.max(
																	1,
																	Math.min(50, Number(event.target.value) || 1),
																),
															)
														}
													/>
													<Button
														type="button"
														variant="outline"
														size="icon-sm"
														onClick={() => {
															const next = Math.min(50, quantity + 1);
															field.onChange(next);
														}}
													>
														<Plus className="size-4" />
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-2">
									<p className="text-sm font-medium">Modo de seleção</p>
									<div className="grid grid-cols-2 gap-2">
										<Button
											type="button"
											variant={
												selectionMode === "manual" ? "default" : "outline"
											}
											onClick={() => form.setValue("selectionMode", "manual")}
										>
											Escolher números
										</Button>
										<Button
											type="button"
											variant={
												selectionMode === "random" ? "default" : "outline"
											}
											onClick={() => form.setValue("selectionMode", "random")}
										>
											Aleatório
										</Button>
									</div>

									{selectionMode === "random" ? (
										<Button
											type="button"
											variant="outline"
											onClick={randomizeSelection}
											disabled={isRandomizing || isEnded}
											className="w-full"
										>
											{isRandomizing ? "Sorteando..." : "Sortear"}
										</Button>
									) : null}
								</div>

								<FormField
									control={form.control}
									name="selectedNumbers"
									render={() => (
										<FormItem>
											<div className="rounded-md border border-border/70 bg-muted/20 p-2 text-xs text-muted-foreground">
												{selectedNumbers.length > 0
													? `Bilhetes: ${selectedNumbers.join(", ")}`
													: "Nenhum bilhete selecionado"}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="buyerName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="buyerEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>E-mail</FormLabel>
											<FormControl>
												<Input type="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="buyerPhone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Telefone</FormLabel>
											<FormControl>
												<Input type="tel" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Separator />
								<div className="rounded-md border border-primary/35 bg-primary/10 px-3 py-2 text-sm">
									<div className="flex items-center justify-between">
										<span>Total</span>
										<strong className="text-primary">
											{formatCurrency(quantity * raffle.ticketPrice)}
										</strong>
									</div>
								</div>

								<Button type="submit" className="w-full" disabled={isEnded}>
									Ir para pagamento
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
