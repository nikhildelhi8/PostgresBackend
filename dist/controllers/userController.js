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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("../zod/zod");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//function for input validation
const client = new client_1.PrismaClient();
dotenv_1.default.config();
const secretkey = process.env.JWT_SECRET;
const checkPayload = (payload) => {
    const isUserValid = zod_1.loginSchemaCheck.safeParse(payload);
    if (!isUserValid.success) {
        return {
            valid: false,
            errors: isUserValid.error.issues.map((issue) => issue.message),
        };
    }
    return { valid: true };
};
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const isInputValid = checkPayload(payload);
    if (!isInputValid.valid) {
        res.status(400).json({ errors: isInputValid.errors });
        return;
    }
    try {
        const result = yield client.user.create({
            data: {
                username: payload.username,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
            },
        });
        void res.status(201).json({
            msg: `User is created with ${result.username}`,
            user: result,
        });
        return;
    }
    catch (error) {
        console.error("something went wrong");
        next(error);
    }
});
const userSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const isInputValid = checkPayload(payload);
    if (!isInputValid.valid) {
        res.status(400).json({ errors: isInputValid.errors });
        return;
    }
    try {
        const result = yield client.user.findFirst({
            where: {
                AND: [{ username: payload.username }, { password: payload.password }],
            },
        });
        if (!result) {
            res.status(401).send("user not found");
            return;
        }
        if (!secretkey) {
            throw new Error("jwt secret key is missing ");
        }
        const token = jsonwebtoken_1.default.sign({ id: result.id }, secretkey);
        res.status(200).json({
            msg: "user found",
            token: token,
        });
        return;
    }
    catch (error) {
        console.error("the issue is ", error);
        next(error);
    }
});
const userController = { userSignin, userSignup };
exports.default = userController;
