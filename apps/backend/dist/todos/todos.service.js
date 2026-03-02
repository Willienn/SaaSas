"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
let TodosService = class TodosService {
    todos = [];
    getTodoById(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) {
            throw new common_1.NotFoundException('Todo not found.');
        }
        return todo;
    }
    getAllTodos() {
        return this.todos;
    }
    createTodo(todoData) {
        const todo = {
            ...todoData,
            id: Math.random().toString(36).substring(2, 15),
            createdAt: new Date().toISOString(),
        };
        this.todos.push(todo);
        return todo;
    }
    updateTodo(id, data) {
        const idx = this.todos.findIndex((t) => t.id === id);
        if (idx === -1) {
            throw new common_1.NotFoundException('Todo not found.');
        }
        this.todos[idx] = {
            ...this.todos[idx],
            ...data,
        };
        return this.todos[idx];
    }
    deleteTodo(id) {
        const idx = this.todos.findIndex((t) => t.id === id);
        if (idx === -1) {
            throw new common_1.NotFoundException('Todo not found.');
        }
        this.todos.splice(idx, 1);
        return true;
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)()
], TodosService);
//# sourceMappingURL=todos.service.js.map