const { z } = require("zod")

const errorSchema = z.object({
  message: z.string(),
}).openapi("ErrorResponse");

module.exports = {
    errorSchema
}