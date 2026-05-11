const CustomError = require("./CustomErrors");

class ValidationError extends CustomError {
    constructor(message = "Validation error") {
    super(message, 400); // Código de estado HTTP para error de validación
    }
}

class NotFoundError extends CustomError {
    constructor(message = "Resource not found") {
    super(message, 404); // Código de estado HTTP para recurso no encontrado
    }
}

class UnauthorizedError extends CustomError {
    constructor(message ="Unauthorized") {
    super(message, 401); // Código de estado HTTP para no autorizado
    }
}

class ForbiddenError extends CustomError {
    constructor(message = "Forbidden") {
    super(message, 403); // Código de estado HTTP para prohibido
    }
}

class InternalServerError extends CustomError {
    constructor(message = "Internal server error") {
    super(message, 500); // Código de estado HTTP para error interno del servidor
    }

}

class ConflictError extends CustomError {
    constructor(message = "Conflict") {
    super(message, 409); // Código de estado HTTP para conflicto
    }
}

class RateLimitError extends CustomError {
    constructor(message = "Too many request"){
    super(message, 429); // Código de estado HTTP para peticiones sobre el limite
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    ConflictError,
    RateLimitError
}