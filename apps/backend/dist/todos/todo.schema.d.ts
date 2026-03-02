import { z } from 'zod';
export declare const todoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    completed: z.ZodBoolean;
    createdAt: z.ZodString;
    dueDate: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}, {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}>;
export declare const createTodoSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    completed: z.ZodBoolean;
    createdAt: z.ZodString;
    dueDate: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    completed: boolean;
    dueDate?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}, {
    name: string;
    description: string;
    completed: boolean;
    dueDate?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;
