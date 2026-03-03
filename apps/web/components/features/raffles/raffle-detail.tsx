"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import {
	OrderStatusBadge,
	RaffleStatusBadge,
} from "@/components/common/status-badges";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";
import { orders } from "@/mocks/orders";
import { paymentMethodSchema } from "@/mocks/payments";
import { raffles } from "@/mocks/raffles";
import { users } from "@/mocks/users";

const createOrderSchema = z.object({
	quantity: z.coerce.number().int().min(1).max(50),
	paymentMethod: paymentMethodSchema,
});

type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

export function RaffleDetail({ raffleId }: { raffleId: string }) {
	const isLoading = useMockLoading();

	const raffle = useMemo(
		() => raffles.find((item) => item.id === raffleId),
		[raffleId],
	);

	const linkedOrders = useMemo(() => {
		return orders
			.filter((order) => order.raffleId === raffleId)
			.map((order) => ({
				...order,
				userName:
					users.find((user) => user.id === order.userId)?.name ??
					"Unknown user",
			}));
	}, [raffleId]);

	const form = useForm<CreateOrderFormValues>({
		resolver: zodResolver(createOrderSchema),
		defaultValues: {
			quantity: 1,
			paymentMethod: "pix",
		},
	});

	if (isLoading) {
		return <LoadingTableSkeleton rows={5} />;
	}

	if (!raffle) {
		return (
			<EmptyState
				icon={ClipboardList}
				title="Raffle not found"
				description="This mock raffle does not exist or has been removed from the local dataset."
			/>
		);
	}

	const occupancy = (raffle.soldTickets / raffle.totalTickets) * 100;

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button asChild variant="outline" size="sm">
					<Link href="/raffles">Back to raffles</Link>
				</Button>
				<RaffleStatusBadge status={raffle.status} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl uppercase tracking-[0.04em]">
						{raffle.title}
					</CardTitle>
					<CardDescription>{raffle.description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-3 md:grid-cols-3">
						<article className="rounded-md border border-border/70 bg-background/40 p-3">
							<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
								Ticket Price
							</p>
							<p className="mt-1 text-lg font-semibold">
								{formatCurrency(raffle.ticketPrice)}
							</p>
						</article>
						<article className="rounded-md border border-border/70 bg-background/40 p-3">
							<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
								Created At
							</p>
							<p className="mt-1 text-lg font-semibold">
								{formatDate(raffle.createdAt)}
							</p>
						</article>
						<article className="rounded-md border border-border/70 bg-background/40 p-3">
							<p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
								Ends At
							</p>
							<p className="mt-1 text-lg font-semibold">
								{formatDateTime(raffle.endsAt)}
							</p>
						</article>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Ticket occupancy</span>
							<span className="font-medium">{occupancy.toFixed(1)}%</span>
						</div>
						<div className="h-2 rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary"
								style={{ width: `${occupancy}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{raffle.soldTickets} sold out of {raffle.totalTickets}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="uppercase tracking-[0.04em]">
								Linked Orders
							</CardTitle>
							<CardDescription>
								Orders currently attached to this raffle.
							</CardDescription>
						</div>

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">Open details</Button>
							</DialogTrigger>
							<DialogContent className="max-w-3xl">
								<DialogHeader>
									<DialogTitle>Orders for {raffle.title}</DialogTitle>
									<DialogDescription>
										Data from local mocks, no API calls.
									</DialogDescription>
								</DialogHeader>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Qty</TableHead>
											<TableHead>Total</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{linkedOrders.map((order) => (
											<TableRow key={order.id}>
												<TableCell>{order.id}</TableCell>
												<TableCell>{order.userName}</TableCell>
												<TableCell>{order.quantity}</TableCell>
												<TableCell>
													{formatCurrency(order.totalAmount)}
												</TableCell>
												<TableCell>
													<OrderStatusBadge status={order.status} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</DialogContent>
						</Dialog>
					</CardHeader>

					<CardContent>
						<p className="text-sm text-muted-foreground">
							{linkedOrders.length} order(s) connected to this raffle.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="uppercase tracking-[0.04em]">
							Mock Order Form
						</CardTitle>
						<CardDescription>
							Submit action logs payload and shows toast only.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-4"
								onSubmit={form.handleSubmit((values) => {
									// Simulação de regra de negócio: gera payload local sem persistência real.
									const payload = {
										raffleId,
										quantity: values.quantity,
										paymentMethod: values.paymentMethod,
									};

									console.log("[mock] create order from raffle", payload);
									toast.success("Mock order created. Check console output.");
									form.reset(values);
								})}
							>
								<FormField
									control={form.control}
									name="quantity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantity</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={1}
													max={50}
													{...field}
													onChange={(event) =>
														field.onChange(event.target.value)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="paymentMethod"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Payment method</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="w-full">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="pix">Pix</SelectItem>
														<SelectItem value="credit_card">
															Credit Card
														</SelectItem>
														<SelectItem value="debit_card">
															Debit Card
														</SelectItem>
														<SelectItem value="boleto">Boleto</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Separator />

								<Button type="submit" className="w-full">
									<PlusCircle className="size-4" />
									Simulate order
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
