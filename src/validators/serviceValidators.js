const { z } = require("zod");

const serviceSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().min(1, "Description is required").max(500, "Description is too long"),
    durationMinutes: z.number()
        .int("Duration must be an integer")
        .positive("Duration must be a positive number"),
    price: z.number()
        .positive("Price must be a positive number"), 
    isActive: z.boolean().default(true)
});

module.exports = {
    serviceSchema
};