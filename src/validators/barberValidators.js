const { z } = require("zod");
const { userSchema } = require("./userValidators");
const { createBarber } = require("../repositories/barberRepository");

const barberSchema = z.object({
    experienceYears: z.number()
        .int("Experience must be whole number")
        .nonnegative("Experience cannot be negative")
        .max(50, "Experience cannot exceed 50 years"),
    bio: z.string()
        .trim()
        .min(1, "Bio is required")
        .max(500, "Bio cannot exceed 500 characters")
});

const barberCreateSchema = userSchema.merge(barberSchema);
const barberUpdateSchema = barberCreateSchema.partial();

module.exports = {
    barberSchema,
    barberCreateSchema,
    barberUpdateSchema
};