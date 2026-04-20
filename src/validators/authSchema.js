const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name is too long" }),
    
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),
    
  password: z.string()
    .min(4, { message: "Password must be at least 4 characters long" })
});

const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),
  password: z.string()
    .min(4, { message: "Password must be at least 4 characters long" }) 
});

module.exports = {
  registerSchema,
  loginSchema
};