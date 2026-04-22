const winston = require("winston");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const logFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.errors({ stack: true }),
    winston.format.json()
)

const logger = winston.createLogger({
    level:"info",
    format:logFormat,
    transports: [
        // Guardar errores criticos en un archivo
        new winston.transports.File({
            filename: path.join("logs","error.log"),
            level:"error"
        }),
        // Guardar logs en otro archivo
        new winston.transports.File({
            filename: path.join("logs","combined.log")
        })
    ]
})

if(process.env.NODE_ENV !== "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

module.exports = logger;