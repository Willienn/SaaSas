import { z } from "zod";

export const paymentStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"refunded",
]);
export const paymentMethodSchema = z.enum([
	"pix",
	"credit_card",
	"debit_card",
	"boleto",
]);

export const paymentSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	amount: z.number().positive(),
	status: paymentStatusSchema,
	method: paymentMethodSchema,
	processedAt: z.string().datetime(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

const rawPayments: Payment[] = [
	{
		id: "pay_001",
		orderId: "ord_001",
		amount: 239.6,
		status: "paid",
		method: "pix",
		processedAt: "2026-03-01T18:13:10.000Z",
	},
	{
		id: "pay_002",
		orderId: "ord_002",
		amount: 119.8,
		status: "pending",
		method: "credit_card",
		processedAt: "2026-03-01T19:02:30.000Z",
	},
	{
		id: "pay_003",
		orderId: "ord_003",
		amount: 144,
		status: "paid",
		method: "credit_card",
		processedAt: "2026-03-02T10:22:15.000Z",
	},
	{
		id: "pay_004",
		orderId: "ord_004",
		amount: 54,
		status: "failed",
		method: "boleto",
		processedAt: "2026-03-02T10:33:00.000Z",
	},
	{
		id: "pay_005",
		orderId: "ord_005",
		amount: 298,
		status: "pending",
		method: "pix",
		processedAt: "2026-03-02T13:01:30.000Z",
	},
	{
		id: "pay_006",
		orderId: "ord_006",
		amount: 14.9,
		status: "paid",
		method: "debit_card",
		processedAt: "2026-03-02T16:11:00.000Z",
	},
	{
		id: "pay_007",
		orderId: "ord_007",
		amount: 239.4,
		status: "refunded",
		method: "credit_card",
		processedAt: "2026-03-03T09:41:20.000Z",
	},
	{
		id: "pay_008",
		orderId: "ord_008",
		amount: 119.8,
		status: "failed",
		method: "pix",
		processedAt: "2026-03-03T08:08:00.000Z",
	},
];

export const payments = z.array(paymentSchema).parse(rawPayments);
