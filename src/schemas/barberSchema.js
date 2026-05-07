const { z } = require("zod");
const { userCreateSchema } = require("./userSchema");

const barberSchema = z.object({
  experienceYears: z.number()
    .int("Experience must be whole number")
    .nonnegative("Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  bio: z.string()
    .trim()
    .min(1, "Bio is required")
    .max(500, "Bio cannot exceed 500 characters"),
});

const barberCreateSchema = userCreateSchema
  .merge(barberSchema)
  .extend({role: z.literal("BARBER"),})
  .openapi("BarberCreate");

const barberUpdateSchema = barberSchema
  .partial()
  .extend({
    fullName: z.string()
      .trim()
      .min(3, "Full name must have at least 3 characters")
      .max(100, "Full name cannot exceed 100 characters")
      .optional(),
    email: z.string()
      .email()
      .optional()
  })
  .openapi("BarberUpdate");

const barberResponseSchema = z.object({
  userId: z.number().openapi({ example: 1 }),
  experienceYears: z.number().openapi({ example: 5 }),
  bio: z.string().openapi({
    example: "Especialista en cortes modernos"
  }),
  user: z.object({
    id: z.number().openapi({ example: 1 }),
    fullName: z.string().openapi({
      example: "Diego Salamanca"
    }),
    email: z.string().openapi({
      example: "diego@test.com"
    }),
    role: z.enum(["CLIENT", "BARBER", "ADMIN"])
      .openapi({ example: "BARBER" }),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"])
      .openapi({ example: "ACTIVE" })
  }).nullable()
}).openapi("BarberResponse");


module.exports = {
  barberCreateSchema,
  barberUpdateSchema,
  barberResponseSchema
};