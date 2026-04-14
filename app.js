const express = require('express');
const app = express();
const routes = require('./src/routes/index');
const errorMiddleware = require('./src/middlewares/errorMiddlewares');

app.use(express.json());
app.use("/api/v1",routes);

app.use(errorMiddleware);

module.exports = app;