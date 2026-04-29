const registry = require("../registry");
const { z } = require("zod");

const { reservationCreateSchema,
    reservationResponseSchema,
    reservationUpdateSchema
} = require("../../schemas/reservationSchema");

// Métodos
// getAll
registry.registerPath({
    method: "get",
    path: "/reservations",
    tags: ["Reservations"],
    summary: "Obtener todas las reservaciones",
    description: "Retorna una lista de las reservas. Requiere rol ADMIN",

    security: [{ bearerAuth:[] }],

    responses: {
        200: {
            description: "Lista de reservas",
            content: {
                "application/json":{
                    schema: z.array(reservationResponseSchema),
                }
            }
        },
        401: {
            description: "No autenticado"
        },
        403: {
            description: "No autorizado(requiere ADMIN)"
        }
    }
})

// getById
registry.registerPath({
    method: "get",
    path:"/reservations/{id}",
    tags:["Reservations"],
    summary:"Obtener reserva por ID",
    description:"Retorna una reserva específica. Requiere autenticación.",

    security: [{ bearerAuth:[] }],

    request: {
        params: z.object({
            id: z.coerce.number().openapi({example:1}),
        })
    },

    responses: {
    200: {
      description: "Reserva encontrada",
      content: {
        "application/json": {
          schema: reservationResponseSchema,
        },
      },
    },
    401: {
      description: "No autenticado",
    },
    404: {
      description: "Reserva no encontrada",
    },
  },
})

// Create
registry.registerPath({
    method: "post",
    path:"/reservations",
    tags: ["Reservations"],
    summary:"Crear reserva",
    description:"Agregar una reserva. Requiere autenticación",

    security: [{ bearerAuth:[] }],

    request: {
        body:{
            required: true,
            content: {
                "application/json": {
                    schema: reservationCreateSchema,
                }

            }
        }
    },

    responses: {
        201: {
            description: "Reserva creada correctamente",
            content: {
                "application/json":{
                    schema: reservationResponseSchema,
                }
            }
        },
        400: {
            description:"Error de validación",
        },
        401: {
            description:"No autenticado",
        },
        403: {
            description:"No autorizado (requiere ADMIN)",
        }
    }
})


// Update
registry.registerPath({
    method: "put",
    path: "/reservations/{id}",
    tags: ["Reservations"],
    summary: "Actualizar una reserva",
    description: "Actualiza los datos de una reserva. Requiere autenticación(ADMIN)",

    security: [{ bearerAuth:[] }],

    request: {
        params: z.object({
            id: z.coerce.number().openapi({example: 1}),
        }),
        body: {
            required: true,
            content: {
                "application/json":{
                    schema: reservationUpdateSchema,
                }                
            }
        }
    },
    responses: {
        200:{
            description:"Reserva actualizada",
            content: {
                "application/json":{
                    schema: reservationResponseSchema,
                }
            }
        },
        400:{
            description:"Error de validación",
        },
        401:{
            description:"No autenticado",
        },
        404:{
            description:"Reserva no encontrada",
        }
    }
})

// Cancel
registry.registerPath({
    method:"patch",
    path: "/reservations/cancel/{id}",
    tags: ["Reservations"],
    summary:"Cancelar una reserva",
    description:"Cancela una reserva agendada.",

    security: [{ bearerAuth: [] }],

    request:{
        params: z.object({
            id: z.coerce.number().openapi({ example:1 }),
        })
    },

    responses: {
        200: {
            description: "reserva cancelada correctamente",
        },
        401: {
            description: "No autenticado",
        },
        403: {
            description: "No autorizado(requiere ROL)",
        },
        404: {
            description: "Reserva no encontrada",
        }
    }
})

// Complete
registry.registerPath({
    method:"patch",
    path: "/reservations/complete/{id}",
    tags: ["Reservations"],
    summary:"Completar una reserva",
    description:"Da por terminada una reserva agendada.",

    security: [{ bearerAuth: [] }],

    request:{
        params: z.object({
            id: z.coerce.number().openapi({ example:1 }),
        })
    },

    responses: {
        200: {
            description: "reserva completada correctamente",
        },
        401: {
            description: "No autenticado",
        },
        403: {
            description: "No autorizado(requiere ROL)",
        },
        404: {
            description: "Reserva no encontrada",
        }
    }
})