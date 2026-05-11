const rateLimit = require("express-rate-limit");
const { RateLimitError } = require("../../errors/TypesError");

const authLimiter = rateLimit({
    windowsMs: 60 * 1000, // 1 minuto
    max: 5,
    standarHeaders: true,
    legacyHeaders:false,
    //skipSuccessfulRequests: true,
    handler: (req, res, next) => {
        next(new RateLimitError("Too many request, try again later."))
    }
});

module.exports = authLimiter;