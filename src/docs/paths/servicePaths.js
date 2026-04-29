const registry = require("../registry");
const { z } = require("zod");

const { serviceCreateSchema,
    serviceResponseSchema,
    serviceUpdateSchema
} = require("../../schemas/serviceSchema");

// Métodos
// getAll
registry.registerPath({
    method: "get",
    path: "/services",
    tags:["Services"],
    summary: "Obtener todos los servicios",
    description: "Retorna una lista de usuarios. Requiere rol ADMIN",

    security: [{ bearerAuth:[] }],

    responses: {
        200: {
            description: "Lista de servicios",
            content: {
                "application/json":{
                    schema: z.array(serviceResponseSchema),
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
    path:"/services/{id}",
    tags:["Services"],
    summary:"Obtener servicio por ID",
    description:"Retorna un servicio específico. Requiere autenticación.",

    security: [{ bearerAuth:[] }],

    request: {
        params: z.object({
            id: z.coerce.number().openapi({example:1}),
        })
    },

    responses: {
    200: {
      description: "Servicio encontrado",
      content: {
        "application/json": {
          schema: serviceResponseSchema,
        },
      },
    },
    401: {
      description: "No autenticado",
    },
    404: {
      description: "Servicio no encontrado",
    },
  },
})

// Create
registry.registerPath({
    method: "post",
    path:"/services",
    tags: ["Services"],
    summary:"Crear servicio",
    description:"Agregar un servicio. Requiere rol ADMIN",

    security: [{ bearerAuth:[] }],

    request: {
        body:{
            required: true,
            content: {
                "application/json": {
                    schema: serviceCreateSchema,
                }

            }
        }
    },

    responses: {
        201: {
            description: "Servicio creado correctamente",
            content: {
                "application/json":{
                    schema: serviceResponseSchema,
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
    path: "/services/{id}",
    tags: ["Services"],
    summary: "Actualizar un servicio",
    description: "Actualiza los datos de un servicio. Requiere autenticación(ADMIN)",

    security: [{ bearerAuth:[] }],

    request: {
        params: z.object({
            id: z.coerce.number().openapi({example: 1}),
        }),
        body: {
            required: true,
            content: {
                "application/json":{
                    schema: serviceUpdateSchema,
                }                
            }
        }
    },
    responses: {
        200:{
            description:"Servicio actualizado",
            content: {
                "application/json":{
                    schema: serviceResponseSchema,
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
            description:"Servicio no encontrado",
        }
    }
})

// Soft Delete
registry.registerPath({
    method:"delete",
    path: "/services/{id}",
    tags: ["Services"],
    summary:"Desactivar servicio",
    description:"Desactivar un servicio. Requiere rol ADMIN.",

    security: [{ bearerAuth: [] }],

    request:{
        params: z.object({
            id: z.coerce.number().openapi({ example:1 }),
        })
    },

    responses: {
        200: {
            description: "Servicio desactivado correctamente",
        },
        401: {
            description: "No autenticado",
        },
        403: {
            description: "No autorizado(requiere ADMIN)",
        },
        404: {
            description: "Servicio no encontrado",
        }
    }
})