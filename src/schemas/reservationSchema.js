const { z } = require("zod");

const reservationSchema = z.object({
    barberId: z.number()
        .positive("Invalid barber ID"),
    clientId: z.number()
        .positive("Invalid client ID"),
    serviceId: z.number()
        .positive("Invalid service ID"),
    startTime: z.coerce
        .date()
        .refine(date => date.getTime() > Date.now(), "Start time must be in the future")
        .optional(),
    notes: z.string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable()
});

const reservationUpdateSchema = z.object({
    startTime: z.coerce
        .date()
        .refine(date => date.getTime() > Date.now(), "Start time must be in the future")
        .optional(),
    serviceId: z.number()
        .positive("Invalid service ID")
        .optional(),
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
});

module.exports = { 
    reservationSchema,
    reservationUpdateSchema
}