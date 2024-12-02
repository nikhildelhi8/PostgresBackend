import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// import todoRouter from "./routes/todoRouter";
import {userRouter} from "./routes/userRouter";
import {todoRouter} from "./routes/todoRouter";

const app = express();

app.use(express.json());
app.use(cors());

//routes
app.use("/user", userRouter);
app.use("/todo", todoRouter);

//global catch function
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
