const { z } = require("zod");
const registry = require("../docs/registry");

const registerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name is too long" })
    .openapi({ example: "Diego Salamanca" }),
    
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" })
    .openapi({ example: "admin@test.com" }),
    
  password: z.string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .openapi({ example: "1234test" })
}).openapi("registerSchema");

const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" })
    .openapi({ example: "admin@test.com" }),
  password: z.string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .openapi({ example: "1234test" }), 
}).openapi("loginSchema");

const authResponseSchema = z.object({
  token: z.string()
    .openapi({ example: "jwtToken" }),
}).openapi("AuthResponse");

module.exports = {
  registerSchema,
  loginSchema,
  authResponseSchema
};