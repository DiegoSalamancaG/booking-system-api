const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const registry = require("../docs/registry");
const { OpenApiGeneratorV3 } = require("@asteasolutions/zod-to-openapi");
dotenv.config();
const port = process.env.PORT || 3000;

// solo ejecutamos los path 
// side-effect import
// require("../docs/paths/");

//carga de modelos
const fs = require("fs");
const path = require("path");
const { type } = require("os");
const pathsDir = path.join(__dirname,"../docs/paths");
const schemasDir = path.join(__dirname,"../schemas")

fs.readdirSync(pathsDir).forEach(file => {
    require(path.join(pathsDir,file));
});
fs.readdirSync(schemasDir).forEach(file => {
    require(path.join(schemasDir, file));
});

// Generador basado en Zod
const generator = new OpenApiGeneratorV3(registry.definitions);

// Documento OpenAPI generado
const docs = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "Booking System API",
        version: "1.0.0",
        description: "Backend REST API profesional para gestión de reservas y disponibilidad de barbería.",
    },
    servers: [
        {
            url: `http://localhost:${port}/api/v1`,
            description: "Development Server"
        }
    ],
});
docs.components = docs.components || {};
docs.components.securitySchemes={
    bearerAuth:{
        type:"http",
        scheme:"bearer",
        bearerFormat: "JWT"
    }
}
docs.security = [{bearerAuth:[]}]

module.exports = {
    swaggerUi,
    docs
};