const { ValidationError } = require("../errors/TypesError")
const validate = (schema) => (req,res,next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (e) {
        const details = e.errors ? e.errors.map(err => err.message).join(", ") : "Validation error";
        next(new ValidationError(details));
    }
};


module.exports = validate;