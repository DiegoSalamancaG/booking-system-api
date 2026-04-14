//const logger = require("../modules/utils/logger/logger.js")

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        status: status,
        message: message,
        error: true
    });
};

module.exports = errorMiddleware;