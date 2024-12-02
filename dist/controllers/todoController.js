"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("../zod/zod");
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
//Schema validation
const todoInputCheck = (todos) => {
    const isValid = zod_1.todoSchemaCheck.safeParse(todos);
    if (!isValid.success) {
        return {
            valid: false,
            error: isValid.error.issues.map((error) => error.message),
        };
    }
    return {
        valid: true,
    };
};
const addTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const isInputValid = todoInputCheck(payload);
    if (!isInputValid.valid) {
        res.status(401).json({
            msg: "wrong inputs",
            error: isInputValid.error,
        });
        return;
    }
    try {
        const result = yield client.todo.create({
            data: {
                title: payload.title,
                description: payload.description,
                userId: payload.userId,
            },
        });
        res.status(201).json({
            msg: "todo is created ",
            todoId: result.id,
        });
        return;
    }
    catch (e) {
        console.error("some error occured");
        next(e);
    }
});
const getTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const todos = yield client.todo.findMany({
            where: {
                userId: parseInt(id),
            },
        });
        res.status(200).json({
            todos: todos,
        });
        return;
    }
    catch (error) {
        console.error("error fetching todos", error);
        next(error);
    }
});
const updateTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    if (typeof id !== "string" || isNaN(Number(id))) {
        res.status(400).json({ msg: "Invalid id format" });
        return;
    }
    const numericId = parseInt(id);
    const payload = req.body;
    const isValid = todoInputCheck(payload);
    if (!isValid.valid) {
        res.status(401).json({
            msg: "inputs not correct",
            error: isValid.error,
        });
        return;
    }
    try {
        const updateTodo = yield client.todo.update({
            where: {
                id: numericId,
            },
            data: {
                title: payload.title,
                description: payload.description,
                isDone: payload.isDone,
            },
        });
        res.status(200).json({
            msg: "updated the query ",
            todoId: id,
            updateTodo: updateTodo,
        });
        return;
    }
    catch (error) {
        console.error("error");
        next(error);
    }
});
const deleteTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const userId = req.query.userId;
    if (typeof id !== "string" || isNaN(Number(id))) {
        res.status(400).json({ msg: "Invalid id format" });
        return;
    }
    try {
        yield client.todo.delete({
            where: {
                id_userId: {
                    id: Number(id),
                    userId: Number(userId),
                },
            },
        });
        res.status(200).send(`todo is deleted with ${id}`);
    }
    catch (e) { }
});
const todoController = { addTodos, getTodos, updateTodos, deleteTodos };
exports.default = todoController;
