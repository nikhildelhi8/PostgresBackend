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
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretkey = process.env.JWT_SECRET;
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenPayload = req.headers.authorization;
    console.log(tokenPayload);
    if (!tokenPayload || !tokenPayload.startsWith("Bearer")) {
        res.status(401).send("no token is provided or Bearer is missing");
        return;
    }
    const token = tokenPayload.split(" ")[1];
    if (!secretkey) {
        throw new Error("jwt_secret is not defined in the environment variable");
    }
    try {
        jsonwebtoken_1.default.verify(token, secretkey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Invalid or expired token" });
            }
            // Attach userId to the request object
            req.userId = decoded.userId; // `decoded.userId` is the userId from the token payload
            next();
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.userAuth = userAuth;
