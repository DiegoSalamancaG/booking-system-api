const { z } = require("zod");
const { userSchema } = require("./userValidators");

const barberSchema = z.object({
    experienceYears: z.number().int().positive("Experience must be a positive integer"),
    bio: z.string().min(1, "Bio is required"),
});

const barberCreateSchema = userSchema.merge(barberSchema);

module.exports = {
    barberSchema,
    barberCreateSchema
};