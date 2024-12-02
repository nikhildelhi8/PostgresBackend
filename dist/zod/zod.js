"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoSchemaCheck = exports.loginSchemaCheck = void 0;
const zod_1 = __importDefault(require("zod"));
//zod schema
const loginSchemaCheck = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.loginSchemaCheck = loginSchemaCheck;
const todoSchemaCheck = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
});
exports.todoSchemaCheck = todoSchemaCheck;
