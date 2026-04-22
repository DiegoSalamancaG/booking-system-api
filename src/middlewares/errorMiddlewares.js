const { url } = require("zod");
const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal server error';

    // Determinar lvl del log, error para 500, warn para 400
    const logLevel = statusCode >= 500 ? "error":"warn";

    logger.log(logLevel, {
        message: message,
        method: req.method,
        url: req.originalUrl,
        statusCode: statusCode,
        stack: status >= 500 ? err.stack : undefined,
        ip: req.ip
    })

    res.status(statusCode).json({
        status: status,
        message: message,
        error: true
    });
};

module.exports = errorMiddleware;