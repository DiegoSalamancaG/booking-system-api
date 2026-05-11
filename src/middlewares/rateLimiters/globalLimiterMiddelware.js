const rateLimit = require("express-rate-limit");

const globatLimiter = rateLimit({
    windowsMs : 15 * 60 * 1000,
    max: 100,
    standarHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many request, please try again later."
    }
});

module.exports = globatLimiter;
