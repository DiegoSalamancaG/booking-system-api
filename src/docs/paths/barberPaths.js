const registry = require("../registry");

const { 
  barberCreateSchema,
  barberUpdateSchema,
  barberResponseSchema
} = require("../../schemas/barberSchema");

const { z } = require("zod");

// Métodos
// GetAll
registry.registerPath({
  method: "get",
  path: "/barbers",
  tags: ["Barbers"],
  summary: "Obtener todos los barberos",
  description: "Retorna una lista de barberos disponibles",

  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: "Lista de barberos",
      content: {
        "application/json": {
          schema: z.array(barberResponseSchema),
        },
      },
    },
    401: {
      description: "No autenticado",
    },
  },
});


// GetById
registry.registerPath({
  method: "get",
  path: "/barbers/{id}",
  tags: ["Barbers"],
  summary: "Obtener barbero por ID",
  description: "Retorna un barbero específico",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },

  responses: {
    200: {
      description: "Barbero encontrado",
      content: {
        "application/json": {
          schema: barberResponseSchema,
        },
      },
    },
    401: {
      description: "No autenticado",
    },
    404: {
      description: "Barbero no encontrado",
    },
  },
});


// Create
registry.registerPath({
  method: "post",
  path: "/barbers",
  tags: ["Barbers"],
  summary: "Crear barbero",
  description: "Crea un nuevo barbero (usuario + perfil). Requiere ADMIN.",

  security: [{ bearerAuth: [] }],

  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: barberCreateSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Barbero creado correctamente",
      content: {
        "application/json": {
          schema: barberResponseSchema,
        },
      },
    },
    400: {
      description: "Error de validación",
    },
    401: {
      description: "No autenticado",
    },
    403: {
      description: "No autorizado (requiere ADMIN)",
    },
  },
});


// Update
registry.registerPath({
  method: "patch",
  path: "/barbers/{id}",
  tags: ["Barbers"],
  summary: "Actualizar barbero",
  description: "Actualiza los datos de un barbero",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: barberUpdateSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Barbero actualizado",
      content: {
        "application/json": {
          schema: barberResponseSchema,
        },
      },
    },
    400: {
      description: "Error de validación",
    },
    401: {
      description: "No autenticado",
    },
    404: {
      description: "Barbero no encontrado",
    },
  },
});


// Soft Delete
registry.registerPath({
  method: "delete",
  path: "/barbers/{id}",
  tags: ["Barbers"],
  summary: "Desactiva barbero",
  description: "Desactiva un barbero. Requiere ADMIN.",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },

  responses: {
    200: {
      description: "Barbero desactivado correctamente",
    },
    401: {
      description: "No autenticado",
    },
    403: {
      description: "No autorizado (requiere ADMIN)",
    },
    404: {
      description: "Barbero no encontrado",
    },
  },
});