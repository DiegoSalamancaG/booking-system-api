const rateLimit = require('express-rate-limit');

const reservationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many reservation attempts.'
    }
});

module.exports = reservationLimiter;