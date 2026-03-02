"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoSchema = exports.todoSchema = void 0;
const zod_1 = require("zod");
exports.todoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    completed: zod_1.z.boolean(),
    createdAt: zod_1.z.string(),
    dueDate: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
});
exports.createTodoSchema = exports.todoSchema.omit({
    id: true,
    createdAt: true,
});
//# sourceMappingURL=todo.schema.js.map