"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
const express_1 = require("express");
const todoController_1 = __importDefault(require("../controllers/todoController"));
const userAuth_1 = require("../middleware/userAuth");
const todoRouter = (0, express_1.Router)();
exports.todoRouter = todoRouter;
todoRouter.get("/getTodos/:id", userAuth_1.userAuth, todoController_1.default.getTodos);
todoRouter.post("/addTodos", userAuth_1.userAuth, todoController_1.default.addTodos);
todoRouter.put('/updateTodos', userAuth_1.userAuth, todoController_1.default.updateTodos);
todoRouter.delete('/deleteTodos', todoController_1.default.deleteTodos);
