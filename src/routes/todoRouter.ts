import { Router } from "express";

import todoController from "../controllers/todoController";
import { userAuth } from "../middleware/userAuth";

const todoRouter = Router();

todoRouter.get("/getTodos/:id",userAuth,  todoController.getTodos);
todoRouter.post("/addTodos", userAuth, todoController.addTodos);
todoRouter.put('/updateTodos' ,userAuth ,todoController.updateTodos);
todoRouter.delete('/deleteTodos' , todoController.deleteTodos);

export { todoRouter };
