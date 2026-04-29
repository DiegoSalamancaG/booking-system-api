const { z } = require("zod");
const registry = require("../docs/registry");

const serviceCreateSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Name is too long")
        .openapi({exampe: "Corte de pelo"}),
    description: z.string()
        .trim()
        .min(1, "Description is required")
        .max(500, "Description is too long")
        .openapi({example: "Corte de pelo completo con fade incluido"}),
    durationMinutes: z.number()
        .int("Duration must be an integer")
        .positive("Duration must be a positive number")
        .openapi({example:30}),
    price: z.number()
        .positive("Price must be a positive number")
        .openapi({example:10000}), 
    isActive: z.boolean().
        default(true)
        .optional()
        .openapi({example: true})
}).openapi("ServiceCreate");

const serviceUpdateSchema = serviceCreateSchema.partial().openapi("ServiceUpdate");

const serviceResponseSchema = z.object({
    id: z.number().openapi({example:1}),
    name: z.string().openapi({example:"Corte de pelo"}),
    description: z.string().openapi({example:"Corte de pelo con fade incluido"}),
    durationMinutes: z.number().openapi({example:30}),
    price: z.number().openapi({example:10000}),
    isActive: z.boolean().openapi({example:true})
}).openapi("ServiceResponse");
    
module.exports = {
    serviceCreateSchema,
    serviceUpdateSchema,
    serviceResponseSchema
};