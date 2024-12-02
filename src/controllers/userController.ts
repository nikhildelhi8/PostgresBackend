import { NextFunction, Request, Response } from "express";
import { loginSchemaCheck } from "../zod/zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

//function for input validation

const client = new PrismaClient();
dotenv.config();
const secretkey = process.env.JWT_SECRET;

//interface for payload

interface UserPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const checkPayload = (payload: UserPayload) => {
  const isUserValid = loginSchemaCheck.safeParse(payload);

  if (!isUserValid.success) {
    return {
      valid: false,
      errors: isUserValid.error.issues.map((issue) => issue.message),
    };
  }

  return { valid: true };
};

const userSignup = async (req: Request<{}, {}, UserPayload>, res: Response, next: NextFunction): Promise<void> => {
  const payload = req.body;

  const isInputValid = checkPayload(payload);

  if (!isInputValid.valid) {
    res.status(400).json({ errors: isInputValid.errors });
    return;
  }

  try {
    const result = await client.user.create({
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
  } catch (error) {
    console.error("something went wrong");
    next(error);
  }
};

const userSignin = async (req: Request<{}, {}, UserPayload>, res: Response, next: NextFunction): Promise<void> => {
  const payload = req.body;

  const isInputValid = checkPayload(payload);

  if (!isInputValid.valid) {
    res.status(400).json({ errors: isInputValid.errors });
    return;
  }

  try {
    const result = await client.user.findFirst({
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

    const token = jwt.sign({ id: result.id }, secretkey);

    res.status(200).json({
      msg: "user found",
      token: token,
    });
    return;
  } catch (error) {
    console.error("the issue is ", error);
    next(error);
  }
};

const userController = { userSignin, userSignup };

export default userController;
