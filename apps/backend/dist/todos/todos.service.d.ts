import { CreateTodoInput } from './todo.schema';
export declare class TodosService {
    private todos;
    getTodoById(id: string): {
        id: string;
        name: string;
        description: string;
        completed: boolean;
        createdAt: string;
        dueDate?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
    };
    getAllTodos(): {
        id: string;
        name: string;
        description: string;
        completed: boolean;
        createdAt: string;
        dueDate?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
    }[];
    createTodo(todoData: CreateTodoInput): {
        id: string;
        name: string;
        description: string;
        completed: boolean;
        createdAt: string;
        dueDate?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
    };
    updateTodo(id: string, data: Partial<CreateTodoInput>): {
        id: string;
        name: string;
        description: string;
        completed: boolean;
        createdAt: string;
        dueDate?: string | undefined;
        priority?: "low" | "medium" | "high" | undefined;
    };
    deleteTodo(id: string): boolean;
}
