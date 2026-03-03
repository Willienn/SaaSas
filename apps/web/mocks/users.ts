import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "user"]);

export const userSchema = z.object({
	id: z.string(),
	name: z.string().min(2),
	email: z.string().email(),
	role: userRoleSchema,
	createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;

const rawUsers: User[] = [
	{
		id: "usr_001",
		name: "Camila Rocha",
		email: "camila@rafflex.io",
		role: "admin",
		createdAt: "2025-11-12T09:15:00.000Z",
	},
	{
		id: "usr_002",
		name: "Bruno Lima",
		email: "bruno.lima@gmail.com",
		role: "user",
		createdAt: "2025-11-18T11:00:00.000Z",
	},
	{
		id: "usr_003",
		name: "Fernanda Alves",
		email: "fernanda.alves@gmail.com",
		role: "user",
		createdAt: "2025-11-21T14:20:00.000Z",
	},
	{
		id: "usr_004",
		name: "Igor Matos",
		email: "igor.matos@gmail.com",
		role: "user",
		createdAt: "2025-12-02T16:45:00.000Z",
	},
	{
		id: "usr_005",
		name: "Larissa Nunes",
		email: "larissa.nunes@gmail.com",
		role: "admin",
		createdAt: "2025-12-07T18:10:00.000Z",
	},
	{
		id: "usr_006",
		name: "Rafael Moreira",
		email: "rafael.moreira@gmail.com",
		role: "user",
		createdAt: "2025-12-15T10:30:00.000Z",
	},
];

export const users = z.array(userSchema).parse(rawUsers);

export const MOCK_LOGGED_USER = users.find((user) => user.role === "user") ??
	users.find((user) => user.role === "admin") ?? {
		id: "usr_fallback",
		name: "Fallback User",
		email: "fallback@mock.local",
		role: "user",
		createdAt: "2026-01-01T00:00:00.000Z",
	};
