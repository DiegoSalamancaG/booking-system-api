const { ValidationError } = require("../errors/TypesError")
const validate = (schema) => (req,res,next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (e) {
        const details = e.issues
        ? e.issues.map(err => err.message).join(", ")
        : "Validation error";

        console.log("Zod validation error:", e.issues);
        next(new ValidationError(details));
    }
};


module.exports = validate;