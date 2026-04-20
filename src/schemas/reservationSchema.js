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
        .refine(date => date > new Date(), "Start time must be in the future"),
    endTime: z.coerce
        .date()
        .refine(date => date > new Date(), "End time must be in the future"),
    durationMinutes: z.number()
        .int()
        .positive("Duration must be a positive number"),
    priceAtBooking: z.number()
        .positive("Price must be a positive number"),
    notes: z.string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable(),
    status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
        .default('SCHEDULED')
})

const reservationUpdateSchema = reservationSchema.partial();


module.exports = { 
    reservationSchema,
    reservationUpdateSchema
}