import {Router} from "express";

import userController from "../controllers/userController";


const userRouter = Router();

userRouter.post("/signup", userController.userSignup);
userRouter.post("/signin", userController.userSignin);

export { userRouter };