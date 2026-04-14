class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; //Marcar el error como operativo

         Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;