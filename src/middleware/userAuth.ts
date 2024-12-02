import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretkey = process.env.JWT_SECRET;

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    jwt.verify(token, secretkey, (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
      }

      // Attach userId to the request object
      req.userId = decoded.userId; // `decoded.userId` is the userId from the token payload
      next();
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { userAuth };
