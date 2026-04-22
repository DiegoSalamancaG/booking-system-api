const registry = require("../registry");

const { registerSchema,
    loginSchema,
    authResponseSchema
} = require("../../schemas/authSchema");
const { errorSchema } = require("../../schemas/errorSchema");

//Register
registry.registerPath({
    method: "post",
    path:"/auth/register",
    tags : ["Auth"],
    summary: "Registar un nuevo usuario",
    description: "Crea un nuevo usuario en el sistema",

    request:{
        body:{
            required:true,
            content:{
                "application/json":{
                    schema: registerSchema
                }
            }
        }
    },
    responses:{
        201:{
            description: "Usuario registrado correctamente",
            content: {
                "application/json":{
                    schema: authResponseSchema
                }
            }
        },
        400:{
            description: "Error de validación",
            content:{
                "application/json":{
                    schema: errorSchema
                }
            }
        }
    }
})

//Login
registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "Iniciar sesión",
    description: "Autentica un usuario y devuelve un JWT",

    request: {
        body: {
            required: true,
            content: {
                "application/json": {
                schema: loginSchema,
                },
            },
        },
    },

    responses: {
        200: {
            description: "Login exitoso",
        content: {
            "application/json": {
                schema: authResponseSchema,
                },
            },
        },
        400:{
            description: "Error de validación",
            content:{
                "application/json":{
                    schema: errorSchema
                }
            }
        }
    },
});