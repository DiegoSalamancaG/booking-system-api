const express = require("express");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const barberRoutes = require("./barberRoutes");
const serviceRoutes = require("./serviceRoutes");
const reservationRoutes = require("./reservationRoutes");

const router = express.Router()

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/barbers", barberRoutes);
router.use("/services", serviceRoutes);
router.use("/reservations", reservationRoutes);

module.exports = router;
