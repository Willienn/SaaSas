import z from "zod";

export const createUserContract = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
export const userContract = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export type createUser = z.infer<typeof createUserContract>;

export type User = z.infer<typeof userContract>;
