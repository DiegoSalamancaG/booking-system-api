const { z } = require("zod");

const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    role: z.enum(['CLIENT', 'BARBER', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional()
});

module.exports = {
    userSchema
};