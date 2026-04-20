const { z } = require("zod");

const userSchema = z.object({
    fullName: z.string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name is too long"),
    email: z.string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    role: z.enum(['CLIENT', 'BARBER', 'ADMIN'])
        .default('CLIENT')
        .optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED'])
        .default('ACTIVE')
        .optional()
});

const userUpdateSchema = userSchema.partial();

module.exports = {
    userSchema,
    userUpdateSchema
};