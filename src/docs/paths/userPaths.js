const registry = require("../registry");
const { z } = require("zod");

const { userCreateSchema,
    userUpdateSchema,
    userResponseSchema
} = require("../../schemas/userSchema");

// Métodos
// getAll
registry.registerPath({
  method: "get",
  path: "/users/",
  tags: ["Users"],
  summary: "Obtener todos los usuarios",
  description: "Retorna una lista de usuarios. Requiere rol ADMIN.",

  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: "Lista de usuarios",
      content: {
        "application/json": {
          schema: z.array(userResponseSchema),
        },
      },
    },
    401: {
      description: "No autenticado",
    },
    403: {
      description: "No autorizado (requiere ADMIN)",
    },
  },
});


// getById
registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Obtener usuario por ID",
  description: "Retorna un usuario específico. Requiere autenticación.",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },

  responses: {
    200: {
      description: "Usuario encontrado",
      content: {
        "application/json": {
          schema: userResponseSchema,
        },
      },
    },
    401: {
      description: "No autenticado",
    },
    404: {
      description: "Usuario no encontrado",
    },
  },
});

// Create
registry.registerPath({
  method: "post",
  path: "/users",
  tags: ["Users"],
  summary: "Crear usuario",
  description: "Crea un nuevo usuario. Requiere rol ADMIN.",

  security: [{ bearerAuth: [] }],

  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: userCreateSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Usuario creado correctamente",
      content: {
        "application/json": {
          schema: userResponseSchema,
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
  method: "put",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Actualizar usuario",
  description: "Actualiza los datos de un usuario. Requiere autenticación.",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: userUpdateSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Usuario actualizado",
      content: {
        "application/json": {
          schema: userResponseSchema,
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
      description: "Usuario no encontrado",
    },
  },
});


// Soft Delete
registry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Desactivar usuario",
  description: "Desactiva un usuario. Requiere rol ADMIN.",

  security: [{ bearerAuth: [] }],

  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },

  responses: {
    200: {
      description: "Usuario desactivado correctamente",
    },
    401: {
      description: "No autenticado",
    },
    403: {
      description: "No autorizado (requiere ADMIN)",
    },
    404: {
      description: "Usuario no encontrado",
    },
  },
});