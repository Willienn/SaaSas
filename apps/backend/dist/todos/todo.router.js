"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRouter = void 0;
const nestjs_trpc_1 = require("nestjs-trpc");
const todos_service_1 = require("./todos.service");
const zod_1 = require("zod");
const todo_schema_1 = require("./todo.schema");
let TodoRouter = class TodoRouter {
    todosService;
    constructor(todosService) {
        this.todosService = todosService;
    }
    getTodoById(id) {
        return this.todosService.getTodoById(id);
    }
    getAllTodos() {
        return this.todosService.getAllTodos();
    }
    createTodo(todoData) {
        return this.todosService.createTodo(todoData);
    }
    updateTodo(id, data) {
        return this.todosService.updateTodo(id, data);
    }
    deleteTodo(id) {
        return this.todosService.deleteTodo(id);
    }
};
exports.TodoRouter = TodoRouter;
__decorate([
    (0, nestjs_trpc_1.Query)({
        input: zod_1.z.object({ id: zod_1.z.string() }),
        output: todo_schema_1.todoSchema,
    }),
    __param(0, (0, nestjs_trpc_1.Input)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TodoRouter.prototype, "getTodoById", null);
__decorate([
    (0, nestjs_trpc_1.Query)({
        output: zod_1.z.array(todo_schema_1.todoSchema),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodoRouter.prototype, "getAllTodos", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({
        input: todo_schema_1.createTodoSchema,
        output: todo_schema_1.todoSchema,
    }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoRouter.prototype, "createTodo", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({
        input: zod_1.z.object({
            id: zod_1.z.string(),
            data: todo_schema_1.createTodoSchema.partial(),
        }),
        output: todo_schema_1.todoSchema,
    }),
    __param(0, (0, nestjs_trpc_1.Input)('id')),
    __param(1, (0, nestjs_trpc_1.Input)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TodoRouter.prototype, "updateTodo", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({
        input: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        output: zod_1.z.boolean(),
    }),
    __param(0, (0, nestjs_trpc_1.Input)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TodoRouter.prototype, "deleteTodo", null);
exports.TodoRouter = TodoRouter = __decorate([
    (0, nestjs_trpc_1.Router)({ alias: 'todo' }),
    __metadata("design:paramtypes", [todos_service_1.TodosService])
], TodoRouter);
//# sourceMappingURL=todo.router.js.map