// src/types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Add custom properties like userId here
    }
  }
}
