"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import todoRouter from "./routes/todoRouter";
const userRouter_1 = require("./routes/userRouter");
const todoRouter_1 = require("./routes/todoRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//routes
app.use("/user", userRouter_1.userRouter);
app.use("/todo", todoRouter_1.todoRouter);
//global catch function
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || "something went wrong",
    });
};
//global catch is used here 
app.use(errorHandler);
app.listen(3000, () => {
    console.log(`server is running on port ${3000}`);
});
