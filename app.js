const express = require('express');
const app = express();
const routes = require('./src/routes/index');
const errorMiddleware = require('./src/middlewares/errorMiddlewares');

const { docs, swaggerUi } = require("./src/config/swagger")

app.use(express.json());

// Rutas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
app.use("/api/v1",routes);

app.use(errorMiddleware);

module.exports = app;