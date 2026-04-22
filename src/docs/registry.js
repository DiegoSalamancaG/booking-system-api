const { OpenAPIRegistry } =  require("@asteasolutions/zod-to-openapi");
const { extendZodWithOpenApi } = require("@asteasolutions/zod-to-openapi");
const { z } = require("zod");

extendZodWithOpenApi(z);

const registry =  new OpenAPIRegistry();

module.exports = registry;