import { z } from "zod";

export const orderStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"cancelled",
]);

export const orderSchema = z.object({
	id: z.string(),
	raffleId: z.string(),
	userId: z.string(),
	quantity: z.number().int().positive(),
	totalAmount: z.number().positive(),
	status: orderStatusSchema,
	createdAt: z.string().datetime(),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

const rawOrders: Order[] = [
	{
		id: "ord_001",
		raffleId: "raf_001",
		userId: "usr_002",
		quantity: 4,
		totalAmount: 239.6,
		status: "paid",
		createdAt: "2026-03-01T18:12:00.000Z",
	},
	{
		id: "ord_002",
		raffleId: "raf_001",
		userId: "usr_003",
		quantity: 2,
		totalAmount: 119.8,
		status: "pending",
		createdAt: "2026-03-01T19:02:00.000Z",
	},
	{
		id: "ord_003",
		raffleId: "raf_002",
		userId: "usr_004",
		quantity: 8,
		totalAmount: 144,
		status: "paid",
		createdAt: "2026-03-02T10:21:00.000Z",
	},
	{
		id: "ord_004",
		raffleId: "raf_002",
		userId: "usr_006",
		quantity: 3,
		totalAmount: 54,
		status: "failed",
		createdAt: "2026-03-02T10:30:00.000Z",
	},
	{
		id: "ord_005",
		raffleId: "raf_004",
		userId: "usr_003",
		quantity: 20,
		totalAmount: 298,
		status: "pending",
		createdAt: "2026-03-02T13:00:00.000Z",
	},
	{
		id: "ord_006",
		raffleId: "raf_004",
		userId: "usr_002",
		quantity: 1,
		totalAmount: 14.9,
		status: "paid",
		createdAt: "2026-03-02T16:10:00.000Z",
	},
	{
		id: "ord_007",
		raffleId: "raf_003",
		userId: "usr_004",
		quantity: 6,
		totalAmount: 239.4,
		status: "paid",
		createdAt: "2026-02-19T20:45:00.000Z",
	},
	{
		id: "ord_008",
		raffleId: "raf_001",
		userId: "usr_006",
		quantity: 2,
		totalAmount: 119.8,
		status: "cancelled",
		createdAt: "2026-03-03T08:05:00.000Z",
	},
];

export const orders = z.array(orderSchema).parse(rawOrders);
