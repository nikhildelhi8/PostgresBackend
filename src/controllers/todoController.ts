import { Request, Response, NextFunction } from "express";
import { todoSchemaCheck } from "../zod/zod";

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

//interface for todos object
interface TodoPayload {
  title: string;
  description: string;
  userId: number;
}

//Schema validation

const todoInputCheck = (todos: TodoPayload) => {
  const isValid = todoSchemaCheck.safeParse(todos);

  if (!isValid.success) {
    return {
      valid: false,
      error: isValid.error.issues.map((error) => error.message),
    };
  }

  return {
    valid: true,
  };
};

const addTodos = async (req: Request<{}, {}, TodoPayload>, res: Response, next: NextFunction): Promise<void> => {
  const payload = req.body;

  const isInputValid = todoInputCheck(payload);

  if (!isInputValid.valid) {
    res.status(401).json({
      msg: "wrong inputs",
      error: isInputValid.error,
    });
    return;
  }

  try {
    const result = await client.todo.create({
      data: {
        title: payload.title,
        description: payload.description,
        userId: payload.userId,
      },
    });
    res.status(201).json({
      msg: "todo is created ",
      todoId: result.id,
    });
    return;
  } catch (e) {
    console.error("some error occured");
    next(e);
  }
};

const getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const todos = await client.todo.findMany({
      where: {
        userId: parseInt(id),
      },
    });

    res.status(200).json({
      todos: todos,
    });
    return;
  } catch (error) {
    console.error("error fetching todos", error);
    next(error);
  }
};

const updateTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.query.id;

  if (typeof id !== "string" || isNaN(Number(id))) {
    res.status(400).json({ msg: "Invalid id format" });
    return;
  }

  const numericId = parseInt(id);
  const payload = req.body;

  const isValid = todoInputCheck(payload);

  if (!isValid.valid) {
    res.status(401).json({
      msg: "inputs not correct",
      error: isValid.error,
    });
    return;
  }

  try {
    const updateTodo = await client.todo.update({
      where: {
        id: numericId,
      },
      data: {
        title: payload.title,
        description: payload.description,
        isDone: payload.isDone,
      },
    });
    res.status(200).json({
      msg: "updated the query ",
      todoId: id,
      updateTodo: updateTodo,
    });
    return;
  } catch (error) {
    console.error("error");
    next(error);
  }
};

const deleteTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.query.id;
  const userId = req.query.userId;

  if (typeof id !== "string" || isNaN(Number(id))) {
    res.status(400).json({ msg: "Invalid id format" });
    return;
  }

  try {
    await client.todo.delete({
      where: {
        id_userId: {
          id: Number(id),
          userId: Number(userId),
        },
      },
    });

    res.status(200).send(`todo is deleted with ${id}`);
  } catch (e) {}
};

const todoController = { addTodos, getTodos, updateTodos, deleteTodos };

export default todoController;
