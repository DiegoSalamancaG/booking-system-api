const express = require("express");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const barberRoutes = require("./barberRoutes");

const router = express.Router()

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/barbers", barberRoutes);

module.exports = router;
