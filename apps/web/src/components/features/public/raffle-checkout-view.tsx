"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Copy, QrCode } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Confetti } from "@/src/components/features/public/confetti";
import { hashString } from "@/src/components/features/public/helpers";
import { formatCurrency } from "@/src/lib/utils";
import { rafflesMock } from "@/src/mocks/raffles";

const checkoutDraftSchema = z.object({
	raffleId: z.string(),
	raffleTitle: z.string(),
	ticketPrice: z.number().positive(),
	quantity: z.number().int().min(1),
	selectionMode: z.enum(["manual", "random"]),
	selectedNumbers: z.array(z.number()),
	buyerName: z.string(),
	buyerEmail: z.string().email(),
	buyerPhone: z.string(),
	totalAmount: z.number().positive(),
	createdAt: z.string(),
});

type CheckoutDraft = z.infer<typeof checkoutDraftSchema>;

type PaymentMethodTab = "pix" | "card" | "boleto";

const cardPaymentSchema = z.object({
	cardNumber: z
		.string()
		.refine((value) => /^[45]\d{15}$/.test(value.replace(/\D/g, "")), {
			message: "Cartão inválido. Use 16 dígitos iniciando com 4 ou 5.",
		}),
	cardName: z.string().min(3),
	expiry: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, {
		message: "Validade inválida. Use MM/AA.",
	}),
	cvv: z.string().regex(/^\d{3,4}$/, {
		message: "CVV inválido.",
	}),
});

type CardPaymentFormData = z.infer<typeof cardPaymentSchema>;

type SuccessState = {
	method: PaymentMethodTab;
	status: "paid" | "pending";
	orderId: string;
};

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

function formatSeconds(totalSeconds: number): string {
	const safe = Math.max(0, totalSeconds);
	const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
	const seconds = String(safe % 60).padStart(2, "0");
	return `${minutes}:${seconds}`;
}

function formatCardNumberInput(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 16);
	return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiryInput(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 4);
	if (digits.length <= 2) {
		return digits;
	}

	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function RaffleCheckoutView({ raffleId }: { raffleId: string }) {
	const router = useRouter();
	const [draft, setDraft] = useState<CheckoutDraft | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [pixSecondsLeft, setPixSecondsLeft] = useState(900);
	const [activeTab, setActiveTab] = useState<PaymentMethodTab>("pix");
	const [pixLoading, setPixLoading] = useState(false);
	const [cardLoading, setCardLoading] = useState(false);
	const [boletoLoading, setBoletoLoading] = useState(false);
	const [success, setSuccess] = useState<SuccessState | null>(null);

	const cardForm = useForm<CardPaymentFormData>({
		resolver: zodResolver(cardPaymentSchema),
		defaultValues: {
			cardNumber: "",
			cardName: "",
			expiry: "",
			cvv: "",
		},
	});

	const orderId = useMemo(() => {
		if (!draft) {
			return "ord_mock_0000";
		}

		const id = hashString(`${draft.raffleId}-${draft.createdAt}`)
			.toString()
			.slice(0, 6);
		return `ord_mock_${id}`;
	}, [draft]);

	const raffle = useMemo(
		() => rafflesMock.find((item) => item.id === raffleId),
		[raffleId],
	);

	const pixKey = useMemo(
		() => `pix-luckydrop-${orderId}@mock.local`,
		[orderId],
	);

	useEffect(() => {
		const rawDraft = sessionStorage.getItem("checkout_draft");

		if (!rawDraft) {
			router.replace(`/rifas/${raffleId}`);
			setIsReady(true);
			return;
		}

		const parsed = checkoutDraftSchema.safeParse(JSON.parse(rawDraft));
		if (!parsed.success || parsed.data.raffleId !== raffleId) {
			router.replace(`/rifas/${raffleId}`);
			setIsReady(true);
			return;
		}

		setDraft(parsed.data);
		setIsReady(true);
	}, [raffleId, router]);

	useEffect(() => {
		if (!draft || success) {
			return;
		}

		const interval = window.setInterval(() => {
			setPixSecondsLeft((previous) => {
				if (previous <= 1) {
					window.clearInterval(interval);
					return 0;
				}

				return previous - 1;
			});
		}, 1000);

		return () => window.clearInterval(interval);
	}, [draft, success]);

	if (!isReady) {
		return (
			<div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
				<Card className="h-60 animate-pulse" />
				<Card className="h-60 animate-pulse" />
			</div>
		);
	}

	if (!draft || !raffle) {
		return null;
	}

	const lineCode = `34191.79001 01043.510047 91020.150008 7 ${orderId
		.replace(/\D/g, "")
		.padStart(14, "0")
		.slice(0, 14)}`;

	async function copyToClipboard(value: string, label: string) {
		try {
			await navigator.clipboard.writeText(value);
			toast.success(`${label} copiado.`);
		} catch {
			toast.error("Não foi possível copiar.");
		}
	}

	function handlePaymentSuccess(state: SuccessState) {
		sessionStorage.removeItem("checkout_draft");
		setSuccess(state);
	}

	return (
		<section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
			<Card>
				<CardHeader>
					<CardTitle>Resumo da compra</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-sm">
					<div>
						<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
							Rifa
						</p>
						<p className="text-lg font-semibold">{draft.raffleTitle}</p>
					</div>

					<div className="rounded-md border border-border/70 bg-muted/20 p-3">
						<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
							Bilhetes
						</p>
						<p className="mt-1 font-mono text-xs">
							{draft.selectionMode === "random" &&
							draft.selectedNumbers.length === 0
								? "Aleatório"
								: draft.selectedNumbers.join(", ")}
						</p>
					</div>

					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Preço unitário</span>
							<span>{formatCurrency(draft.ticketPrice)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Quantidade</span>
							<span>{draft.quantity}</span>
						</div>
						<div className="flex items-center justify-between text-base font-semibold">
							<span>Total</span>
							<span className="text-primary">
								{formatCurrency(draft.totalAmount)}
							</span>
						</div>
					</div>

					<Separator />

					<div className="space-y-1">
						<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
							Comprador
						</p>
						<p>{draft.buyerName}</p>
						<p className="text-muted-foreground">{draft.buyerEmail}</p>
						<p className="text-muted-foreground">{draft.buyerPhone}</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pagamento</CardTitle>
				</CardHeader>
				<CardContent>
					{success ? (
						<div className="relative overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6">
							<Confetti
								active
								className="pointer-events-none absolute inset-0"
							/>
							<div className="relative z-10 space-y-3">
								<CheckCircle2 className="size-10 animate-pulse text-emerald-400" />
								<h3 className="text-2xl">Pagamento confirmado</h3>
								<p className="text-sm text-muted-foreground">
									Pedido {success.orderId} registrado com status{" "}
									{success.status === "paid"
										? "pago"
										: "aguardando compensação"}
									.
								</p>
								<p className="text-xs text-muted-foreground">
									Bilhetes: {draft.selectedNumbers.join(", ") || "Aleatório"}
								</p>
								<Button asChild className="w-full">
									<Link href="/meus-pedidos">Ver meus pedidos</Link>
								</Button>
							</div>
						</div>
					) : (
						<Tabs
							value={activeTab}
							onValueChange={(value) => setActiveTab(value as PaymentMethodTab)}
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="pix">PIX</TabsTrigger>
								<TabsTrigger value="card">Cartão</TabsTrigger>
								<TabsTrigger value="boleto">Boleto</TabsTrigger>
							</TabsList>

							<TabsContent value="pix" className="space-y-4 pt-4">
								<div className="flex items-center gap-4 rounded-lg border border-border/80 p-3">
									<img
										src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PIX_MOCK_${orderId}`}
										alt="QR code PIX"
										className="size-36 rounded-md border border-border/70 bg-white p-2"
									/>
									<div className="space-y-2 text-sm">
										<p className="inline-flex items-center gap-2 font-medium">
											<QrCode className="size-4 text-primary" />
											Pague com PIX
										</p>
										<p className="font-mono text-xs text-muted-foreground">
											{pixKey}
										</p>
										<Button
											type="button"
											variant="outline"
											onClick={() => copyToClipboard(pixKey, "Chave PIX")}
										>
											<Copy className="size-4" />
											Copiar
										</Button>
									</div>
								</div>
								<div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
									Tempo restante: {formatSeconds(pixSecondsLeft)}
								</div>
								<Button
									type="button"
									className="w-full"
									disabled={pixLoading || pixSecondsLeft === 0}
									onClick={async () => {
										setPixLoading(true);
										await wait(1500);
										setPixLoading(false);
										handlePaymentSuccess({
											method: "pix",
											status: "paid",
											orderId,
										});
									}}
								>
									{pixLoading
										? "Confirmando pagamento..."
										: "Simular pagamento"}
								</Button>
							</TabsContent>

							<TabsContent value="card" className="space-y-4 pt-4">
								<Form {...cardForm}>
									<form
										className="space-y-3"
										onSubmit={cardForm.handleSubmit(async (values) => {
											setCardLoading(true);
											await wait(2000);
											setCardLoading(false);

											if (Math.random() < 0.8) {
												handlePaymentSuccess({
													method: "card",
													status: "paid",
													orderId,
												});
												return;
											}

											console.log("[mock] card declined", {
												orderId,
												card: values.cardNumber,
											});
											toast.error("Pagamento recusado. Tente novamente.");
										})}
									>
										<FormField
											control={cardForm.control}
											name="cardNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Número do cartão</FormLabel>
													<FormControl>
														<Input
															placeholder="0000 0000 0000 0000"
															value={field.value}
															onChange={(event) =>
																field.onChange(
																	formatCardNumberInput(event.target.value),
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={cardForm.control}
											name="cardName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nome no cartão</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className="grid grid-cols-2 gap-3">
											<FormField
												control={cardForm.control}
												name="expiry"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Validade</FormLabel>
														<FormControl>
															<Input
																placeholder="MM/AA"
																value={field.value}
																onChange={(event) =>
																	field.onChange(
																		formatExpiryInput(event.target.value),
																	)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={cardForm.control}
												name="cvv"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CVV</FormLabel>
														<FormControl>
															<Input
																placeholder="123"
																value={field.value}
																onChange={(event) =>
																	field.onChange(
																		event.target.value
																			.replace(/\D/g, "")
																			.slice(0, 4),
																	)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<Button
											type="submit"
											className="w-full"
											disabled={cardLoading}
										>
											{cardLoading ? "Processando..." : "Pagar com cartão"}
										</Button>
									</form>
								</Form>
							</TabsContent>

							<TabsContent value="boleto" className="space-y-4 pt-4">
								<div className="rounded-md border border-border/70 bg-muted/20 p-3">
									<p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
										Linha digitável
									</p>
									<p className="mt-2 font-mono text-xs leading-relaxed text-foreground/90">
										{lineCode}
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => copyToClipboard(lineCode, "Linha digitável")}
								>
									<Copy className="size-4" />
									Copiar boleto
								</Button>
								<p className="text-xs text-muted-foreground">
									Compensação em até 3 dias úteis após pagamento.
								</p>
								<Button
									type="button"
									className="w-full"
									disabled={boletoLoading}
									onClick={async () => {
										setBoletoLoading(true);
										await wait(900);
										setBoletoLoading(false);
										toast.success("Boleto gerado com sucesso.");
										handlePaymentSuccess({
											method: "boleto",
											status: "pending",
											orderId,
										});
									}}
								>
									{boletoLoading ? "Gerando boleto..." : "Confirmar"}
								</Button>
							</TabsContent>
						</Tabs>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
