const { z } = require("zod");
const registry = require("../docs/registry");

const userCreateSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name is too long")
    .openapi({ example: "Diego Salamanca" }),
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .openapi({ example: "diego@test.com" }),
  password: z.string()
    .min(4, "Password must be at least 4 characters long")
    .openapi({ example: "1234" }),
  role: z.enum(['CLIENT', 'BARBER', 'ADMIN'])
    .optional()
    .openapi({ example: "CLIENT" }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED'])
    .optional()
    .openapi({ example: "ACTIVE" }),

}).openapi("UserCreate");

const userUpdateSchema = userCreateSchema.partial().openapi("UserUpdate");

const userResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  fullName: z.string().openapi({ example: "Diego Salamanca" }),
  email: z.string().openapi({ example: "diego@test.com" }),
  role: z.enum(['CLIENT', 'BARBER', 'ADMIN']).openapi({ example: "CLIENT" }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).openapi({ example: "ACTIVE" }),
  createdAt: z.string().openapi({
    example: "22-04-2026 18:30",
    description: "Fecha en formato local (Chile)"
  }),
  updatedAt: z.string().openapi({
    example: "22-04-2026 18:30",
    description: "Fecha en formato local (Chile)"
  }),
}).openapi("UserResponse");

module.exports = {
    userCreateSchema,
    userUpdateSchema,
    userResponseSchema
};