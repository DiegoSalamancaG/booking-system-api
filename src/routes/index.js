const express = require("express");

// Rutas
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const barberRoutes = require("./barberRoutes");
const serviceRoutes = require("./serviceRoutes");
const reservationRoutes = require("./reservationRoutes");

// RateLImit
const authLimit = require("../middlewares/rateLimiters/authLimiterMiddleware")
const reservationLimiter = require("../middlewares/rateLimiters/reservationLimiterMiddleware")

const router = express.Router()

router.use("/users", userRoutes);
router.use("/auth", authLimit, authRoutes);
router.use("/barbers", barberRoutes);
router.use("/services", serviceRoutes);
router.use("/reservations", reservationLimiter, reservationRoutes);

module.exports = router;
