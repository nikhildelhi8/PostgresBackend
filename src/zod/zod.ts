import z from "zod";

//zod schema

const loginSchemaCheck = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

const todoSchemaCheck = z.object({
  title: z.string(),
  description: z.string(),
});

export { loginSchemaCheck , todoSchemaCheck};
