const { z, exactOptional } = require("zod");

const reservationCreateSchema = z.object({
    barberId: z.number()
        .positive("Invalid barber ID")
        .openapi({example: 14}),
    clientId: z.number()
        .positive("Invalid client ID")
        .openapi({example: 11}),
    serviceId: z.number()
        .positive("Invalid service ID")
        .openapi({example: 3}),
    startTime: z.coerce
        .date()
        .refine(date => date.getTime() > Date.now(), "Start time must be in the future")
        .optional(),
    notes: z.string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable()
}).openapi("ReservationCreate");

const reservationUpdateSchema = z.object({
    startTime: z.coerce
        .date()
        .refine(date => date.getTime() > Date.now(), "Start time must be in the future")
        .optional(),
    serviceId: z.number()
        .positive("Invalid service ID")
        .optional()
        .openapi({example: 1}),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"])
        .optional(),
    notes: z.string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable()

}).refine(data =>
    data.startTime !== undefined ||
    data.status !== undefined ||
    data.notes !== undefined ||
    data.serviceId !== undefined,
{
    message: "At least one field must be provided for update"
}).openapi("ReservationUpdate");

const reservationResponseSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    startTime: z.string().openapi({example: "22-04-2026 18:30"}),
    endTime:  z.string().openapi({example: "22-04-2026 19:30"}),
    status:z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']).openapi({ example: "SCHEDULED" }),
    barberId: z.number().openapi({ example: 14 }),
    clientId: z.number().openapi({ example: 11 }),
    serviceId: z.number().openapi({ example: 3 }),
    notes: z.string().openapi({example:"Notas del cliente"}),
    priceAtBooking: z.number().openapi({example: 10000})
}).openapi("ReservationResponse")


module.exports = { 
    reservationCreateSchema,
    reservationUpdateSchema,
    reservationResponseSchema
}