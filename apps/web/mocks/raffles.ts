import { z } from "zod";

export const raffleStatusSchema = z.enum([
	"draft",
	"active",
	"closed",
	"cancelled",
]);

export const raffleSchema = z.object({
	id: z.string(),
	title: z.string().min(3),
	description: z.string().min(10),
	ticketPrice: z.number().positive(),
	totalTickets: z.number().int().positive(),
	soldTickets: z.number().int().nonnegative(),
	status: raffleStatusSchema,
	endsAt: z.string().datetime(),
	createdAt: z.string().datetime(),
});

export type Raffle = z.infer<typeof raffleSchema>;
export type RaffleStatus = z.infer<typeof raffleStatusSchema>;

const rawRaffles: Raffle[] = [
	{
		id: "raf_001",
		title: "Porsche 911 Carrera 2020",
		description:
			"Rifa premium com edição limitada de 3.500 números e sorteio ao vivo.",
		ticketPrice: 59.9,
		totalTickets: 3500,
		soldTickets: 2844,
		status: "active",
		endsAt: "2026-03-18T23:59:00.000Z",
		createdAt: "2026-01-10T12:00:00.000Z",
	},
	{
		id: "raf_002",
		title: "Kit Studio Gamer Black Edition",
		description:
			"Setup completo com cadeira, monitor ultrawide e periféricos de alta performance.",
		ticketPrice: 18,
		totalTickets: 5000,
		soldTickets: 4021,
		status: "active",
		endsAt: "2026-03-09T23:00:00.000Z",
		createdAt: "2026-01-21T12:30:00.000Z",
	},
	{
		id: "raf_003",
		title: "Viagem para Dubai para 2 pessoas",
		description: "Pacote com aéreo e hotel cinco estrelas para sete noites.",
		ticketPrice: 39.9,
		totalTickets: 2500,
		soldTickets: 2500,
		status: "closed",
		endsAt: "2026-02-20T22:00:00.000Z",
		createdAt: "2025-12-20T08:00:00.000Z",
	},
	{
		id: "raf_004",
		title: "Moto Street 300cc 0km",
		description: "Rifa mensal com preço popular e alta taxa de conversão.",
		ticketPrice: 14.9,
		totalTickets: 7000,
		soldTickets: 1630,
		status: "active",
		endsAt: "2026-04-02T20:30:00.000Z",
		createdAt: "2026-02-03T15:00:00.000Z",
	},
	{
		id: "raf_005",
		title: "iPhone 17 Pro Max + Apple Watch",
		description:
			"Combo de lançamento com retirada em até 48h após confirmação de pagamento.",
		ticketPrice: 12,
		totalTickets: 8000,
		soldTickets: 1180,
		status: "draft",
		endsAt: "2026-05-10T21:00:00.000Z",
		createdAt: "2026-02-28T13:00:00.000Z",
	},
	{
		id: "raf_006",
		title: "Sala de Cinema em Casa",
		description:
			"Rifa cancelada por ajuste comercial e replanejamento de premiação.",
		ticketPrice: 24,
		totalTickets: 3000,
		soldTickets: 214,
		status: "cancelled",
		endsAt: "2026-03-01T21:00:00.000Z",
		createdAt: "2026-01-30T11:20:00.000Z",
	},
];

export const raffles = z.array(raffleSchema).parse(rawRaffles);
